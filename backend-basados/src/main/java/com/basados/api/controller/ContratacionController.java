package com.basados.api.controller;

import com.basados.api.dto.ContratacionRequest;
import com.basados.api.dto.ContratacionResponse;
import com.basados.api.service.ContratacionService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrataciones")
public class ContratacionController {

    private final ContratacionService contratacionService;

    public ContratacionController(ContratacionService contratacionService) {
        this.contratacionService = contratacionService;
    }

    @PostMapping
    public ResponseEntity<ContratacionResponse> crear(@Valid @RequestBody ContratacionRequest request) {
        return ResponseEntity.ok(contratacionService.crear(request));
    }

    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<ContratacionResponse>> getByEvento(@PathVariable String idEvento) {
        return ResponseEntity.ok(contratacionService.listarPorEvento(idEvento));
    }
}
