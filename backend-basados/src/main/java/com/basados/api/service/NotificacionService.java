package com.basados.api.service;

import com.basados.api.dto.DestinatarioDto;
import com.basados.api.dto.NotificacionResponse;
import com.basados.api.dto.ResumenEventoRequest;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {

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
        int enviadosWhatsapp = 0;
        int enviadosEmail = 0;

        String mensajeWhatsapp = construirMensajeWhatsapp(request);

        if (request.getDestinatarios() == null || request.getDestinatarios().isEmpty()) {
            return new NotificacionResponse(0, 0);
        }

        for (DestinatarioDto destinatario : request.getDestinatarios()) {
            if (destinatario.getCanal() == null || destinatario.getDestino() == null || destinatario.getDestino().isBlank()) {
                continue;
            }

            if ("whatsapp".equalsIgnoreCase(destinatario.getCanal())) {
                try {
                    whatsAppService.enviarMensaje(destinatario.getDestino(), mensajeWhatsapp);
                    enviadosWhatsapp++;
                    System.out.println("✅ WhatsApp enviado a " + destinatario.getDestino());
                } catch (Exception e) {
                    System.err.println("❌ Error enviando WhatsApp a " + destinatario.getDestino());
                    e.printStackTrace();
                }
            } else if ("email".equalsIgnoreCase(destinatario.getCanal())) {
                try {
                    String cuerpoPersonalizado = construirCorreoPersonalizado(request, destinatario);
                    byte[] pdf = pdfService.generarPdfResumen(request, destinatario);

                    emailService.enviarCorreoConAdjunto(
                            destinatario.getDestino(),
                            "Resumen de tu evento BASADOS 📄",
                            cuerpoPersonalizado,
                            pdf
                    );

                    enviadosEmail++;
                    System.out.println("📎 Email con PDF enviado a " + destinatario.getDestino());

                } catch (Exception e) {
                    System.err.println("❌ Error enviando email a " + destinatario.getDestino());
                    e.printStackTrace();
                }
            }
        }

        return new NotificacionResponse(enviadosWhatsapp, enviadosEmail);
    }

    private String construirCorreoPersonalizado(ResumenEventoRequest request, DestinatarioDto destinatario) {
        return "Hola " + valorSeguro(destinatario.getNombre()) + ",\n\n" +
                "Tu evento fue planificado con BASADOS 🔥\n\n" +
                "Evento: " + valorSeguro(request.getNombreEvento()) + "\n" +
                "Fecha: " + valorSeguro(request.getFecha()) + "\n" +
                "Participantes: " + valorNumero(request.getParticipantes()) + "\n\n" +
                "💰 Tu aporte: $" + valorNumero(destinatario.getMonto()) + "\n\n" +
                "Costo total: $" + valorNumero(request.getCostoTotal()) + "\n" +
                "Promedio por persona: $" + valorNumero(request.getCostoPromedio()) + "\n" +
                "🔥 Calorías por persona: " + valorNumero(request.getCaloriasPorPersona()) + " kcal\n" +
                "🛒 Supermercado: " + valorSeguro(request.getCotizacionSeleccionada()) + "\n\n" +
                "Organizador: " + valorSeguro(request.getOrganizador()) + "\n\n" +
                "Adjuntamos además tu resumen en PDF.\n\n" +
                "Gracias por usar BASADOS 🚀";
    }

    private String construirMensajeWhatsapp(ResumenEventoRequest request) {
        return "Resumen BASADOS\n" +
                "Evento: " + valorSeguro(request.getNombreEvento()) + "\n" +
                "Fecha: " + valorSeguro(request.getFecha()) + "\n" +
                "Participantes: " + valorNumero(request.getParticipantes()) + "\n" +
                "Costo total: $" + valorNumero(request.getCostoTotal()) + "\n" +
                "Promedio por persona: $" + valorNumero(request.getCostoPromedio()) + "\n" +
                "Calorías por persona: " + valorNumero(request.getCaloriasPorPersona()) + " kcal\n" +
                "Supermercado sugerido: " + valorSeguro(request.getCotizacionSeleccionada()) + "\n" +
                "Organizador: " + valorSeguro(request.getOrganizador());
    }

    private String valorSeguro(String valor) {
        return valor == null || valor.isBlank() ? "No definido" : valor;
    }

    private int valorNumero(Integer valor) {
        return valor == null ? 0 : valor;
    }
}