package com.basados.api.controller;

import com.basados.api.dto.NotificacionResponse;
import com.basados.api.dto.ResumenEventoRequest;
import com.basados.api.service.NotificacionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    @PostMapping("/resumen")
    public ResponseEntity<NotificacionResponse> enviarResumen(@RequestBody ResumenEventoRequest request) {
        NotificacionResponse response = notificacionService.enviarResumenEvento(request);
        return ResponseEntity.ok(response);
    }
}
