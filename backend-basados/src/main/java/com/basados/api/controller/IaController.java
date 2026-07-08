package com.basados.api.controller;

import com.basados.api.dto.*;
import com.basados.api.service.IaCuotaService;
import com.basados.api.service.ia.IaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/ia")
public class IaController {

    private static final int TOKENS_ESTIMADOS = 500;

    private final IaService iaService;
    private final IaCuotaService iaCuotaService;

    public IaController(IaService iaService, IaCuotaService iaCuotaService) {
        this.iaService = iaService;
        this.iaCuotaService = iaCuotaService;
    }

    @PostMapping("/sugerencias")
    public IaResponseDTO sugerencias(@Valid @RequestBody SugerenciasRequest req, HttpServletRequest request) {
        String ip = obtenerIpSegura(request);
        verificarYReservarCuota(ip);
        IaResponseDTO respuesta = iaService.generarSugerencias(req);
        iaCuotaService.ajustarConsumoReal(ip, TOKENS_ESTIMADOS, respuesta.getTokensConsumidos());
        return respuesta;
    }

    @PostMapping("/cotizacion")
    public IaResponseDTO cotizacion(@Valid @RequestBody CotizacionIaRequest req, HttpServletRequest request) {
        String ip = obtenerIpSegura(request);
        verificarYReservarCuota(ip);
        IaResponseDTO respuesta = iaService.analizarCotizacion(req);
        iaCuotaService.ajustarConsumoReal(ip, TOKENS_ESTIMADOS, respuesta.getTokensConsumidos());
        return respuesta;
    }

    private void verificarYReservarCuota(String ip) {
        if (!iaCuotaService.verificarYReservarCuota(ip, TOKENS_ESTIMADOS)) {
            throw new ResponseStatusException(
                HttpStatus.TOO_MANY_REQUESTS,
                "Alcanzaste tu límite diario de uso de IA. Vuelve a intentarlo mañana."
            );
        }
    }

    private String obtenerIpSegura(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() != null
                && !"anonymousUser".equals(auth.getPrincipal())) {
            return "user:" + auth.getPrincipal().toString();
        }
        return request.getRemoteAddr();
    }
}