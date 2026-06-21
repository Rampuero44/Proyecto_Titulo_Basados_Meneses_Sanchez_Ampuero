package com.basados.api.controller;

import com.basados.api.dto.MaestroParrilleroDTO;
import com.basados.api.service.MaestroParrilleroService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maestros-parrilleros")
public class MaestroParrilleroController {

    private final MaestroParrilleroService maestroParrilleroService;

    public MaestroParrilleroController(MaestroParrilleroService maestroParrilleroService) {
        this.maestroParrilleroService = maestroParrilleroService;
    }

    @GetMapping
    public ResponseEntity<List<MaestroParrilleroDTO>> getAll() {
        return ResponseEntity.ok(maestroParrilleroService.listarDisponibles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaestroParrilleroDTO> getById(@PathVariable Long id) {
        return maestroParrilleroService.obtenerPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}
