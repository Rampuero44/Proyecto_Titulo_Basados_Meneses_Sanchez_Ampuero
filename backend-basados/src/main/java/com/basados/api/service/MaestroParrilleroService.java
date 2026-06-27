package com.basados.api.service;

import com.basados.api.dto.InscripcionAsadorRequest;
import com.basados.api.dto.MaestroParrilleroDTO;
import com.basados.api.entity.MaestroParrillero;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.MaestroParrilleroRepository;
import com.basados.api.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class MaestroParrilleroService {

    private static final Logger log = LoggerFactory.getLogger(MaestroParrilleroService.class);

    private final MaestroParrilleroRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public MaestroParrilleroService(MaestroParrilleroRepository repository,
                                     UsuarioRepository usuarioRepository,
                                     EmailService emailService) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.emailService = emailService;
    }

    @Transactional(readOnly = true)
    public List<MaestroParrilleroDTO> listarDisponibles() {
        return repository.findAllDisponibles()
            .stream()
            .map(this::toDTO)
            .toList();
    }

    @Transactional(readOnly = true)
    public Optional<MaestroParrilleroDTO> obtenerPorId(Long id) {
        return repository.findById(id).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<MaestroParrilleroDTO> listarPorEstado(String estado) {
        return repository.findAllByEstadoSolicitud(estado)
            .stream()
            .map(this::toDTO)
            .toList();
    }

    @Transactional
    public void aprobar(Long id) {
        MaestroParrillero maestro = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Maestro no encontrado"));

        maestro.setEstadoSolicitud("APROBADO");
        maestro.setDisponibilidad(true);

        if (maestro.getUsuario() != null) {
            maestro.getUsuario().setRol("MAESTRO");
            maestro.getUsuario().setActivo(true);
            usuarioRepository.save(maestro.getUsuario());
        }
        repository.save(maestro);

        enviarCorreoAprobacion(maestro);
    }

    @Transactional
    public void rechazar(Long id) {
        MaestroParrillero maestro = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Maestro no encontrado"));

        maestro.setEstadoSolicitud("RECHAZADO");
        maestro.setDisponibilidad(false);

        if (maestro.getUsuario() != null) {
            maestro.getUsuario().setRol("MAESTRO_RECHAZADO");
            maestro.getUsuario().setActivo(false);
            usuarioRepository.save(maestro.getUsuario());
        }
        repository.save(maestro);

        enviarCorreoRechazo(maestro);
    }

    @Transactional
    public void revocar(Long id) {
        MaestroParrillero maestro = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Maestro no encontrado"));

        maestro.setEstadoSolicitud("PENDIENTE");
        maestro.setDisponibilidad(false);

        if (maestro.getUsuario() != null) {
            maestro.getUsuario().setRol("MAESTRO_PENDIENTE");
            maestro.getUsuario().setActivo(false);
            usuarioRepository.save(maestro.getUsuario());
        }
        repository.save(maestro);
    }

    @Transactional
    public void inscribir(InscripcionAsadorRequest req) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByCorreo(req.getCorreo());

        if (usuarioExistente.isPresent()) {
            Usuario u = usuarioExistente.get();

            boolean tienePendiente = repository.findAllByEstadoSolicitud("PENDIENTE").stream()
                .anyMatch(m -> m.getUsuario() != null &&
                    m.getUsuario().getIdUsuario().equals(u.getIdUsuario()));
            if (tienePendiente) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este correo ya tiene una solicitud pendiente de revisión.");
            }

            boolean estaAprobado = repository.findAllByEstadoSolicitud("APROBADO").stream()
                .anyMatch(m -> m.getUsuario() != null &&
                    m.getUsuario().getIdUsuario().equals(u.getIdUsuario()));
            if (estaAprobado) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este correo ya está registrado como Maestro Asador aprobado.");
            }

            Optional<MaestroParrillero> rechazadoExistente = repository
                .findAllByEstadoSolicitud("RECHAZADO").stream()
                .filter(m -> m.getUsuario() != null &&
                    m.getUsuario().getIdUsuario().equals(u.getIdUsuario()))
                .findFirst();

            if (rechazadoExistente.isPresent()) {
                MaestroParrillero maestro = rechazadoExistente.get();
                maestro.setEstadoSolicitud("PENDIENTE");
                maestro.setDisponibilidad(false);
                maestro.setExperienciaAnos(req.getExperienciaAnos());
                maestro.setValorServicio(req.getValorServicio() != null
                    ? req.getValorServicio() : BigDecimal.ZERO);
                maestro.setDescripcion(buildDescripcion(req));

                u.setNombre(req.getNombre());
                u.setApellido(req.getApellido());
                u.setTelefono(req.getTelefono());
                u.setRol("MAESTRO_PENDIENTE");
                u.setActivo(false);
                usuarioRepository.save(u);
                repository.save(maestro);

                enviarCorreoInscripcion(req.getCorreo(), req.getNombre());
                return;
            }
        }

        Usuario usuario = usuarioExistente.orElseGet(() -> {
            Usuario nuevo = new Usuario();
            nuevo.setIdUsuario(UUID.randomUUID());
            nuevo.setNombre(req.getNombre());
            nuevo.setApellido(req.getApellido());
            nuevo.setCorreo(req.getCorreo());
            nuevo.setTelefono(req.getTelefono());
            nuevo.setPasswordHash("PENDIENTE");
            nuevo.setRol("MAESTRO_PENDIENTE");
            nuevo.setActivo(false);
            nuevo.setIaTokensConsumidos(0);
            return usuarioRepository.save(nuevo);
        });

        MaestroParrillero maestro = new MaestroParrillero();
        maestro.setUsuario(usuario);
        maestro.setDescripcion(buildDescripcion(req));
        maestro.setExperienciaAnos(req.getExperienciaAnos());
        maestro.setValorServicio(req.getValorServicio() != null
            ? req.getValorServicio() : BigDecimal.ZERO);
        maestro.setDisponibilidad(false);
        maestro.setEstadoSolicitud("PENDIENTE");
        maestro.setPuntuacion(BigDecimal.ZERO);

        repository.save(maestro);

        enviarCorreoInscripcion(req.getCorreo(), req.getNombre());
    }

    private void enviarCorreoInscripcion(String correo, String nombre) {
        try {
            String asunto = "BASADOS – Solicitud recibida";
            String cuerpo = String.format(
                "Hola %s,\n\n" +
                "Recibimos tu solicitud para unirte como Maestro Asador en BASADOS.\n\n" +
                "Nuestro equipo revisará tu perfil y te contactaremos a este correo en los próximos días hábiles con la decisión.\n\n" +
                "Gracias por tu interés.\n\n" +
                "Equipo BASADOS",
                nombre
            );
            emailService.enviarCorreo(correo, asunto, cuerpo);
        } catch (Exception e) {
            log.warn("[EMAIL] No se pudo enviar confirmación de inscripción a {}: {}", correo, e.getMessage());
        }
    }

    private void enviarCorreoAprobacion(MaestroParrillero maestro) {
        if (maestro.getUsuario() == null || maestro.getUsuario().getCorreo() == null) return;
        try {
            String nombre = maestro.getUsuario().getNombre() != null
                ? maestro.getUsuario().getNombre() : "Maestro";
            String correo = maestro.getUsuario().getCorreo();
            String asunto = "BASADOS – ¡Tu solicitud fue aprobada!";
            String cuerpo = String.format(
                "Hola %s,\n\n" +
                "¡Buenas noticias! Tu solicitud para ser Maestro Asador en BASADOS fue aprobada.\n\n" +
                "Tu perfil ya está activo y visible para los usuarios que organicen un asado en la plataforma. " +
                "Desde ahora podrás recibir contrataciones a través de BASADOS.\n\n" +
                "Bienvenido al equipo.\n\n" +
                "Equipo BASADOS",
                nombre
            );
            emailService.enviarCorreo(correo, asunto, cuerpo);
        } catch (Exception e) {
            log.warn("[EMAIL] No se pudo enviar aprobación a {}: {}", maestro.getUsuario().getCorreo(), e.getMessage());
        }
    }

    private void enviarCorreoRechazo(MaestroParrillero maestro) {
        if (maestro.getUsuario() == null || maestro.getUsuario().getCorreo() == null) return;
        try {
            String nombre = maestro.getUsuario().getNombre() != null
                ? maestro.getUsuario().getNombre() : "Maestro";
            String correo = maestro.getUsuario().getCorreo();
            String asunto = "BASADOS – Actualización sobre tu solicitud";
            String cuerpo = String.format(
                "Hola %s,\n\n" +
                "Luego de revisar tu solicitud, lamentamos informarte que en esta oportunidad no pudimos aprobar tu perfil como Maestro Asador en BASADOS.\n\n" +
                "Si crees que hubo un error o deseas más información, puedes contactarnos respondiendo este correo.\n\n" +
                "Podrás volver a postular en el futuro si tus antecedentes cambian.\n\n" +
                "Muchas gracias por tu interés.\n\n" +
                "Equipo BASADOS",
                nombre
            );
            emailService.enviarCorreo(correo, asunto, cuerpo);
        } catch (Exception e) {
            log.warn("[EMAIL] No se pudo enviar rechazo a {}: {}", maestro.getUsuario().getCorreo(), e.getMessage());
        }
    }

    private String buildDescripcion(InscripcionAsadorRequest req) {
        StringBuilder sb = new StringBuilder();
        if (req.getDescripcion() != null && !req.getDescripcion().isBlank()) {
            sb.append(req.getDescripcion());
        }
        if (req.getCiudad() != null || req.getComuna() != null) {
            sb.append(" | Zona: ");
            if (req.getComuna() != null) sb.append(req.getComuna());
            if (req.getCiudad() != null) sb.append(", ").append(req.getCiudad());
        }
        if (req.getInstagram() != null && !req.getInstagram().isBlank())
            sb.append(" | IG: ").append(req.getInstagram());
        if (req.getFacebook() != null && !req.getFacebook().isBlank())
            sb.append(" | FB: ").append(req.getFacebook());
        if (req.getSitioWeb() != null && !req.getSitioWeb().isBlank())
            sb.append(" | Web: ").append(req.getSitioWeb());
        return sb.toString();
    }

    private MaestroParrilleroDTO toDTO(MaestroParrillero m) {
        return new MaestroParrilleroDTO(
            m.getIdMaestro(),
            m.getUsuario() != null ? m.getUsuario().getNombre() : null,
            m.getUsuario() != null ? m.getUsuario().getApellido() : null,
            m.getUsuario() != null ? m.getUsuario().getCorreo() : null,
            m.getUsuario() != null ? m.getUsuario().getTelefono() : null,
            m.getDescripcion(),
            m.getExperienciaAnos(),
            m.getValorServicio(),
            m.getDisponibilidad(),
            m.getPuntuacion(),
            m.getEstadoSolicitud()
        );
    }
}