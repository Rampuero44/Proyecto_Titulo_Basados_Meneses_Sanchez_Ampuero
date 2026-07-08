package com.basados.api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WhatsAppService {

    private static final Logger log = LoggerFactory.getLogger(WhatsAppService.class);
    private static final int TELEFONO_MIN_LENGTH = 8;

    @Value("${meta.whatsapp.token:#{null}}")
    private String token;

    @Value("${meta.whatsapp.phone-number-id:#{null}}")
    private String phoneNumberId;

    private final RestTemplate restTemplate;

    public WhatsAppService() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000);
        factory.setConnectionRequestTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
    }

    public void enviarMensaje(String numero, String mensaje) {
        if (token == null || token.isEmpty() || phoneNumberId == null || phoneNumberId.isEmpty()) {
            log.warn("WhatsApp no configurado - Token o Phone ID faltante");
            return;
        }

        String numeroNormalizado = normalizarNumero(numero);

        if (numeroNormalizado.length() < TELEFONO_MIN_LENGTH) {
            log.warn("Número de teléfono inválido, omitiendo envío de WhatsApp");
            return;
        }

        try {
            String url = "https://graph.facebook.com/v23.0/" + phoneNumberId + "/messages";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(token);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                    "messaging_product", "whatsapp",
                    "to", numeroNormalizado,
                    "type", "text",
                    "text", Map.of("body", mensaje)
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

            log.info("WhatsApp enviado correctamente. Status: {}", response.getStatusCode());

        } catch (Exception e) {
            log.error("Error enviando WhatsApp: {}", e.getMessage());
        }
    }

    private String normalizarNumero(String numero) {
        if (numero == null) return "";
        return numero.replace("+", "")
                .replace(" ", "")
                .replace("-", "")
                .trim();
    }
}