package com.basados.api.service;

import com.basados.api.dto.DestinatarioDto;
import com.basados.api.dto.NotificacionResponse;
import com.basados.api.dto.ResumenEventoRequest;
import org.springframework.stereotype.Service;

@Service
public class NotificacionService {

    private final WhatsAppService whatsAppService;
    private final EmailService emailService;

    public NotificacionService(WhatsAppService whatsAppService, EmailService emailService) {
        this.whatsAppService = whatsAppService;
        this.emailService = emailService;
    }

    public NotificacionResponse enviarResumenEvento(ResumenEventoRequest request) {
        int enviadosWhatsapp = 0;
        int enviadosEmail = 0;

        String mensaje = construirMensajeWhatsapp(request);
        String asunto = "Resumen de tu evento BASADOS";
        String cuerpoCorreo = construirCorreo(request);

        for (DestinatarioDto destinatario : request.getDestinatarios()) {
            if ("whatsapp".equalsIgnoreCase(destinatario.getCanal())) {
                try {
                    whatsAppService.enviarMensaje(destinatario.getDestino(), mensaje);
                    enviadosWhatsapp++;
                } catch (Exception e) {
                    System.err.println("❌ Error enviando WhatsApp a " + destinatario.getDestino() + ": " + e.getMessage());
                }
            } else if ("email".equalsIgnoreCase(destinatario.getCanal())) {
                try {
                    emailService.enviarCorreo(destinatario.getDestino(), asunto, cuerpoCorreo);
                    enviadosEmail++;
                } catch (Exception e) {
                    System.err.println("❌ Error enviando email a " + destinatario.getDestino() + ": " + e.getMessage());
                }
            }
        }

        return new NotificacionResponse(enviadosWhatsapp, enviadosEmail);
    }

    private String construirMensajeWhatsapp(ResumenEventoRequest request) {
        return "Resumen BASADOS\n" +
                "Evento: " + request.getNombreEvento() + "\n" +
                "Fecha: " + request.getFecha() + "\n" +
                "Participantes: " + request.getParticipantes() + "\n" +
                "Costo total: $" + request.getCostoTotal() + "\n" +
                "Promedio por persona: $" + request.getCostoPromedio() + "\n" +
                "Calorías por persona: " + request.getCaloriasPorPersona() + " kcal\n" +
                "Supermercado sugerido: " + valorSeguro(request.getCotizacionSeleccionada()) + "\n" +
                "Organizador: " + request.getOrganizador();
    }

    private String construirCorreo(ResumenEventoRequest request) {
        return "Hola,\n\n" +
                "Tu evento fue planificado con BASADOS.\n\n" +
                "Evento: " + request.getNombreEvento() + "\n" +
                "Fecha: " + request.getFecha() + "\n" +
                "Participantes: " + request.getParticipantes() + "\n" +
                "Costo total: $" + request.getCostoTotal() + "\n" +
                "Promedio por persona: $" + request.getCostoPromedio() + "\n" +
                "Calorías totales: " + request.getCaloriasTotales() + " kcal\n" +
                "Calorías por persona: " + request.getCaloriasPorPersona() + " kcal\n" +
                "Supermercado sugerido: " + valorSeguro(request.getCotizacionSeleccionada()) + "\n" +
                "Organizador: " + request.getOrganizador() + "\n\n" +
                "Gracias por usar BASADOS.";
    }

    private String valorSeguro(String valor) {
        return valor == null || valor.isBlank() ? "No definido" : valor;
    }
}