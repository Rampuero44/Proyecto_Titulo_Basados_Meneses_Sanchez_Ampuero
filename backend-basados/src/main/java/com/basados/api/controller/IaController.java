package com.basados.api.controller;

import com.basados.api.dto.*;
import com.basados.api.service.ia.IaService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    private final IaService iaService;

    public IaController(IaService iaService) {
        this.iaService = iaService;
    }

    @PostMapping("/sugerencias")
    public IaResponseDTO sugerencias(@RequestBody SugerenciasRequest req) {
        return iaService.generarSugerencias(req);
    }

    @PostMapping("/cotizacion")
    public IaResponseDTO cotizacion(@RequestBody CotizacionIaRequest req) {
        return iaService.analizarCotizacion(req);
    }
}