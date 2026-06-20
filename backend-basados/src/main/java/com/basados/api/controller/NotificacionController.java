package com.basados.api.controller;

import com.basados.api.dto.DestinatarioDto;
import com.basados.api.dto.NotificacionResponse;
import com.basados.api.dto.ResumenEventoRequest;
import com.basados.api.service.NotificacionService;
import com.basados.api.service.PdfService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;
    private final PdfService pdfService;

    public NotificacionController(NotificacionService notificacionService, PdfService pdfService) {
        this.notificacionService = notificacionService;
        this.pdfService = pdfService;
    }

    @PostMapping("/resumen")
    public ResponseEntity<NotificacionResponse> enviarResumen(@Valid @RequestBody ResumenEventoRequest request) {
        NotificacionResponse response = notificacionService.enviarResumenEvento(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/resumen/pdf")
    public ResponseEntity<byte[]> descargarPdf(@Valid @RequestBody ResumenEventoRequest request) {
        DestinatarioDto destinatario = new DestinatarioDto();
        destinatario.setNombre(request.getOrganizador());
        destinatario.setMonto(request.getCostoPromedio());

        byte[] pdf = pdfService.generarPdfResumen(request, destinatario);

        String nombreArchivo = "resumen-" +
            (request.getNombreEvento() != null ? request.getNombreEvento().replaceAll("[^a-zA-Z0-9]", "_") : "evento") +
            ".pdf";

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombreArchivo + "\"")
            .body(pdf);
    }
}