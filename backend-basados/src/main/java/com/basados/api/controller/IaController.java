package com.basados.api.controller;

import com.basados.api.dto.*;
import com.basados.api.service.ia.IaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    private final IaService iaService;

    public IaController(IaService iaService) {
        this.iaService = iaService;
    }

    @PostMapping("/sugerencias")
    public IaResponseDTO sugerencias(@Valid @RequestBody SugerenciasRequest req) {
        return iaService.generarSugerencias(req);
    }

    @PostMapping("/cotizacion")
    public IaResponseDTO cotizacion(@Valid @RequestBody CotizacionIaRequest req) {
        return iaService.analizarCotizacion(req);
    }
}