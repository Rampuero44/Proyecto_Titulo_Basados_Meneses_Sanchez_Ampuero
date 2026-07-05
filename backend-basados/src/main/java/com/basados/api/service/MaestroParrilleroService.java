package com.basados.api.service;

import com.basados.api.dto.InscripcionAsadorRequest;
import com.basados.api.dto.MaestroParrilleroDTO;
import com.basados.api.entity.MaestroParrillero;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.MaestroParrilleroRepository;
import com.basados.api.repository.UsuarioRepository;
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

    private final MaestroParrilleroRepository repository;
    private final UsuarioRepository usuarioRepository;

    public MaestroParrilleroService(MaestroParrilleroRepository repository,
                                     UsuarioRepository usuarioRepository) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
    }

    // Vista pública: solo aprobados y disponibles para contratar
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

    // Panel admin: por estado de solicitud
    @Transactional(readOnly = true)
    public List<MaestroParrilleroDTO> listarPorEstado(String estado) {
        return repository.findAllByEstadoSolicitud(estado)
            .stream()
            .map(this::toDTO)
            .toList();
    }

    // Aprobar: estado_solicitud = APROBADO, usuario activo con rol MAESTRO
    @Transactional
    public void aprobar(Long id) {
        MaestroParrillero maestro = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Maestro no encontrado"));

        maestro.setEstadoSolicitud("APROBADO");
        // Al aprobar, se activa disponibilidad por defecto
        maestro.setDisponibilidad(true);

        if (maestro.getUsuario() != null) {
            maestro.getUsuario().setRol("MAESTRO");
            maestro.getUsuario().setActivo(true);
            usuarioRepository.save(maestro.getUsuario());
        }
        repository.save(maestro);
    }

    // Rechazar: estado_solicitud = RECHAZADO, registro se conserva para trazabilidad
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
    }

    // Revocar aprobación: vuelve a PENDIENTE para revisión
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

    // Inscripción: permite re-inscripción si fue rechazado previamente
    @Transactional
    public void inscribir(InscripcionAsadorRequest req) {
        Optional<Usuario> usuarioExistente = usuarioRepository.findByCorreo(req.getCorreo());

        if (usuarioExistente.isPresent()) {
            Usuario u = usuarioExistente.get();

            // Verificar si ya tiene solicitud PENDIENTE
            boolean tienePendiente = repository.findAllByEstadoSolicitud("PENDIENTE").stream()
                .anyMatch(m -> m.getUsuario() != null &&
                    m.getUsuario().getIdUsuario().equals(u.getIdUsuario()));
            if (tienePendiente) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este correo ya tiene una solicitud pendiente de revisión.");
            }

            // Verificar si ya está aprobado
            boolean estaAprobado = repository.findAllByEstadoSolicitud("APROBADO").stream()
                .anyMatch(m -> m.getUsuario() != null &&
                    m.getUsuario().getIdUsuario().equals(u.getIdUsuario()));
            if (estaAprobado) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Este correo ya está registrado como Maestro Asador aprobado.");
            }

            // Si fue rechazado, reutilizar el registro existente y volver a PENDIENTE
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
                return;
            }
        }

        // Crear nuevo usuario si no existe
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