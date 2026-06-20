package com.basados.api.controller;

import com.basados.api.dto.CotizacionRequestDTO;
import com.basados.api.dto.CotizacionResponseDTO;
import com.basados.api.service.cotizacion.CotizacionService;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cotizaciones")
public class CotizacionController {

    private final CotizacionService cotizacionService;

    public CotizacionController(
            CotizacionService cotizacionService
    ) {

        this.cotizacionService =
                cotizacionService;
    }

    @PostMapping
    public CotizacionResponseDTO cotizar(
            @RequestBody
            CotizacionRequestDTO request
    ) {

        return cotizacionService
                .generarCotizaciones(request);
    }
}