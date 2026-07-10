package com.basados.api.service;

import com.basados.api.dto.DestinatarioDto;
import com.basados.api.dto.NotificacionResponse;
import com.basados.api.dto.ResumenEventoRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificacionService {

    private static final Logger log = LoggerFactory.getLogger(NotificacionService.class);

    private final WhatsAppService whatsAppService;
    private final EmailService emailService;
    private final PdfService pdfService;

    public NotificacionService(
            WhatsAppService whatsAppService,
            EmailService emailService,
            PdfService pdfService
    ) {
        this.whatsAppService = whatsAppService;
        this.emailService = emailService;
        this.pdfService = pdfService;
    }

    public NotificacionResponse enviarResumenEvento(ResumenEventoRequest request) {
        if (request.getDestinatarios() == null || request.getDestinatarios().isEmpty()) {
            return new NotificacionResponse(0, 0);
        }

        int enviadosWhatsapp = 0;
        int enviadosEmail = 0;

        List<DestinatarioDto> destinatarios = new ArrayList<>(request.getDestinatarios());

        if (request.getOrganizadorEmail() != null && !request.getOrganizadorEmail().isBlank()) {
            boolean organizadorIncluido = destinatarios.stream()
                .anyMatch(d -> request.getOrganizadorEmail().equalsIgnoreCase(d.getDestino()));

            if (!organizadorIncluido) {
                DestinatarioDto organizador = new DestinatarioDto();
                organizador.setNombre(request.getOrganizador());
                organizador.setCanal("email");
                organizador.setDestino(request.getOrganizadorEmail());
                organizador.setMonto(request.getCostoPromedio());
                destinatarios.add(0, organizador);
            }
        }

        // Generar PDF base una sola vez para todos los destinatarios por email
        byte[] pdfBase = null;

        for (DestinatarioDto destinatario : destinatarios) {
            if (destinatario.getCanal() == null || destinatario.getDestino() == null
                    || destinatario.getDestino().isBlank()) {
                continue;
            }

            if ("whatsapp".equalsIgnoreCase(destinatario.getCanal())) {
                try {
                    String mensaje = construirMensajeWhatsapp(request, destinatario);
                    whatsAppService.enviarMensaje(destinatario.getDestino(), mensaje);
                    enviadosWhatsapp++;
                    log.info("WhatsApp enviado correctamente");
                } catch (Exception e) {
                    log.error("Error enviando WhatsApp: {}", e.getMessage());
                }

            } else if ("email".equalsIgnoreCase(destinatario.getCanal())) {
                try {
                    if (pdfBase == null) {
                        DestinatarioDto dtoBase = new DestinatarioDto();
                        dtoBase.setNombre(destinatario.getNombre());
                        dtoBase.setMonto(request.getCostoPromedio());
                        pdfBase = pdfService.generarPdfResumen(request, dtoBase);
                    }

                    String cuerpo = construirCorreoPersonalizado(request, destinatario);
                    String nombreArchivo = generarNombreArchivo(request);

                    emailService.enviarCorreoConAdjunto(
                            destinatario.getDestino(),
                            "Resumen de tu evento BASADOS",
                            cuerpo,
                            pdfBase,
                            nombreArchivo
                    );

                    enviadosEmail++;
                    log.info("Email con PDF enviado correctamente");

		} catch (Exception e) {
                    log.error("Error enviando email: {}", e.getMessage(), e);
                }
            }
        }

        return new NotificacionResponse(enviadosWhatsapp, enviadosEmail);
    }

    private String construirCorreoPersonalizado(ResumenEventoRequest request, DestinatarioDto destinatario) {
        return "Hola " + valorSeguro(destinatario.getNombre()) + ",\n\n" +
                "Tu evento fue planificado con BASADOS\n\n" +
                "Evento: " + valorSeguro(request.getNombreEvento()) + "\n" +
                "Fecha: " + valorSeguro(request.getFecha()) + "\n" +
                "Participantes: " + valorNumero(request.getParticipantes()) + "\n\n" +
                "Tu aporte: $" + valorNumero(destinatario.getMonto()) + "\n\n" +
                "Costo total: $" + valorNumero(request.getCostoTotal()) + "\n" +
                "Promedio por persona: $" + valorNumero(request.getCostoPromedio()) + "\n" +
                "Calorías por persona: " + valorNumero(request.getCaloriasPorPersona()) + " kcal\n" +
                "Supermercado: " + valorSeguro(request.getCotizacionSeleccionada()) + "\n\n" +
                "Organizador: " + valorSeguro(request.getOrganizador()) + "\n\n" +
                "Adjuntamos tu resumen en PDF.\n\n" +
                "Gracias por usar BASADOS";
    }

    private String construirMensajeWhatsapp(ResumenEventoRequest request, DestinatarioDto destinatario) {
        return "Resumen BASADOS\n" +
                "Hola " + valorSeguro(destinatario.getNombre()) + "!\n" +
                "Evento: " + valorSeguro(request.getNombreEvento()) + "\n" +
                "Fecha: " + valorSeguro(request.getFecha()) + "\n" +
                "Participantes: " + valorNumero(request.getParticipantes()) + "\n" +
                "Tu aporte: $" + valorNumero(destinatario.getMonto()) + "\n" +
                "Costo total: $" + valorNumero(request.getCostoTotal()) + "\n" +
                "Promedio por persona: $" + valorNumero(request.getCostoPromedio()) + "\n" +
                "Supermercado sugerido: " + valorSeguro(request.getCotizacionSeleccionada()) + "\n" +
                "Organizador: " + valorSeguro(request.getOrganizador());
    }

    private String generarNombreArchivo(ResumenEventoRequest request) {
        String nombre = request.getNombreEvento() != null
            ? request.getNombreEvento().replaceAll("[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ ]", "").trim().replace(" ", "_")
            : "evento";
        return "resumen-" + nombre + ".pdf";
    }

    private String valorSeguro(String valor) {
        return valor == null || valor.isBlank() ? "No definido" : valor;
    }

    private int valorNumero(Integer valor) {
        return valor == null ? 0 : valor;
    }
}