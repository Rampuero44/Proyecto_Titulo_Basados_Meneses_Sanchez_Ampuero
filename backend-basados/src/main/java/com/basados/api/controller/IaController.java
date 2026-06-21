package com.basados.api.controller;

import com.basados.api.dto.*;
import com.basados.api.service.IaCuotaService;
import com.basados.api.service.ia.IaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    private final IaService iaService;
    private final IaCuotaService iaCuotaService;

    public IaController(IaService iaService, IaCuotaService iaCuotaService) {
        this.iaService = iaService;
        this.iaCuotaService = iaCuotaService;
    }

    @PostMapping("/sugerencias")
    public IaResponseDTO sugerencias(@Valid @RequestBody SugerenciasRequest req, HttpServletRequest request) {
        String ip = obtenerIp(request);
        verificarCuota(ip);
        IaResponseDTO respuesta = iaService.generarSugerencias(req);
        iaCuotaService.registrarConsumo(ip, respuesta.getTokensConsumidos());
        return respuesta;
    }

    @PostMapping("/cotizacion")
    public IaResponseDTO cotizacion(@Valid @RequestBody CotizacionIaRequest req, HttpServletRequest request) {
        String ip = obtenerIp(request);
        verificarCuota(ip);
        IaResponseDTO respuesta = iaService.analizarCotizacion(req);
        iaCuotaService.registrarConsumo(ip, respuesta.getTokensConsumidos());
        return respuesta;
    }

    private void verificarCuota(String ip) {
        if (!iaCuotaService.tieneCuotaDisponible(ip)) {
            throw new ResponseStatusException(
                HttpStatus.TOO_MANY_REQUESTS,
                "Alcanzaste tu límite diario de uso de IA. Vuelve a intentarlo mañana."
            );
        }
    }

    private String obtenerIp(HttpServletRequest request) {
        return request.getRemoteAddr();
    }
}