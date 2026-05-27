package com.basados.api.controller;

import com.basados.api.dto.MaestroParrilleroDTO;
import com.basados.api.entity.MaestroParrillero;
import com.basados.api.repository.MaestroParrilleroRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/maestros-parrilleros")
public class MaestroParrilleroController {

    private final MaestroParrilleroRepository repository;

    public MaestroParrilleroController(MaestroParrilleroRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<MaestroParrilleroDTO>> getAll() {
        List<MaestroParrilleroDTO> maestros = repository.findAllDisponibles()
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(maestros);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaestroParrilleroDTO> getById(@PathVariable Long id) {
        return repository.findById(id)
            .map(m -> ResponseEntity.ok(toDTO(m)))
            .orElse(ResponseEntity.notFound().build());
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