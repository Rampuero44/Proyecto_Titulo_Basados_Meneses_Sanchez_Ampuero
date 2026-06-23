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
    public List<MaestroParrilleroDTO> listarPendientes() {
        return repository.findAll().stream()
            .filter(m -> Boolean.FALSE.equals(m.getDisponibilidad()))
            .map(this::toDTO)
            .toList();
    }

    @Transactional
    public void aprobar(Long id) {
        MaestroParrillero maestro = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Maestro no encontrado"));
        maestro.setDisponibilidad(true);
        if (maestro.getUsuario() != null) {
            maestro.getUsuario().setRol("MAESTRO");
            maestro.getUsuario().setActivo(true);
            usuarioRepository.save(maestro.getUsuario());
        }
        repository.save(maestro);
    }

    @Transactional
    public void rechazar(Long id) {
        MaestroParrillero maestro = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Maestro no encontrado"));
        repository.delete(maestro);
    }

    @Transactional
    public void inscribir(InscripcionAsadorRequest req) {
        Usuario usuario = usuarioRepository.findByCorreo(req.getCorreo())
            .orElseGet(() -> {
                Usuario nuevo = new Usuario();
                nuevo.setIdUsuario(UUID.randomUUID());
                nuevo.setNombre(req.getNombre());
                nuevo.setApellido(req.getApellido());
                nuevo.setCorreo(req.getCorreo());
                nuevo.setTelefono(req.getTelefono());
                nuevo.setPasswordHash("PENDIENTE");
                nuevo.setRol("MAESTRO_PENDIENTE");
                nuevo.setActivo(false);
                return usuarioRepository.save(nuevo);
            });

        boolean yaEsMaestro = repository.findAll().stream()
            .anyMatch(m -> m.getUsuario() != null &&
                m.getUsuario().getIdUsuario().equals(usuario.getIdUsuario()));
        if (yaEsMaestro) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                "Este correo ya tiene una solicitud de inscripción registrada");
        }

        StringBuilder descripcionCompleta = new StringBuilder();
        if (req.getDescripcion() != null && !req.getDescripcion().isBlank()) {
            descripcionCompleta.append(req.getDescripcion());
        }
        if (req.getCiudad() != null || req.getComuna() != null) {
            descripcionCompleta.append(" | Zona: ");
            if (req.getComuna() != null) descripcionCompleta.append(req.getComuna());
            if (req.getCiudad() != null) descripcionCompleta.append(", ").append(req.getCiudad());
        }
        if (req.getInstagram() != null && !req.getInstagram().isBlank()) {
            descripcionCompleta.append(" | IG: ").append(req.getInstagram());
        }
        if (req.getFacebook() != null && !req.getFacebook().isBlank()) {
            descripcionCompleta.append(" | FB: ").append(req.getFacebook());
        }
        if (req.getSitioWeb() != null && !req.getSitioWeb().isBlank()) {
            descripcionCompleta.append(" | Web: ").append(req.getSitioWeb());
        }

        MaestroParrillero maestro = new MaestroParrillero();
        maestro.setUsuario(usuario);
        maestro.setDescripcion(descripcionCompleta.toString());
        maestro.setExperienciaAnos(req.getExperienciaAnos());
        maestro.setValorServicio(req.getValorServicio() != null
            ? req.getValorServicio() : BigDecimal.ZERO);
        maestro.setDisponibilidad(false);
        maestro.setPuntuacion(BigDecimal.ZERO);

        repository.save(maestro);
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
            m.getPuntuacion()
        );
    }
}