package com.basados.api.service;

import com.basados.api.dto.MaestroParrilleroDTO;
import com.basados.api.entity.MaestroParrillero;
import com.basados.api.repository.MaestroParrilleroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MaestroParrilleroService {

    private final MaestroParrilleroRepository repository;

    public MaestroParrilleroService(MaestroParrilleroRepository repository) {
        this.repository = repository;
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
