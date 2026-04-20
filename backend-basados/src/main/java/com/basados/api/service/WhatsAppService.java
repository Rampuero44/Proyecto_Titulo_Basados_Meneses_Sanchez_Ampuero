package com.basados.api.service;

import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service

public class WhatsAppService {

    @Value("${meta.whatsapp.token:#{null}}")
    private String token;

    @Value("${meta.whatsapp.phone-number-id:#{null}}")
    private String phoneNumberId;

    private final RestTemplate restTemplate = new RestTemplate();

    public void enviarMensaje(String numero, String mensaje) {
        if (token == null || token.isEmpty() || phoneNumberId == null || phoneNumberId.isEmpty()) {
            System.err.println("⚠️  WhatsApp no configurado - Token o Phone ID faltante");
            return;
        }

        try {
            System.out.println("� Enviando WhatsApp a: " + numero);
            System.out.println("🔍 Token (primeros 30 chars): " + token.substring(0, Math.min(30, token.length())));
            System.out.println("🔍 Phone ID: " + phoneNumberId);
            
            String url = "https://graph.facebook.com/v23.0/" + phoneNumberId + "/messages";
            System.out.println("🌐 URL: " + url);

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                    "messaging_product", "whatsapp",
                    "to", numero,
                    "type", "text",
                    "text", Map.of("body", mensaje)
            );

            System.out.println("📤 Body: " + body);
            
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            var response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);
            
            System.out.println("✅ Respuesta WhatsApp: " + response.getStatusCode() + " - " + response.getBody());
        } catch (Exception e) {
            System.err.println("❌ Error enviando WhatsApp a " + numero + ": " + e.getClass().getSimpleName());
            System.err.println("❌ Mensaje error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}