package com.basados.api.service.ia;

import com.basados.api.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class IaService {

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-haiku-4-5";
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public IaResponseDTO generarSugerencias(SugerenciasRequest req) {
        String productosTexto = req.getProductos() == null || req.getProductos().isEmpty()
            ? "Ninguno seleccionado aún."
            : req.getProductos().stream()
                .map(p -> {
                    String unidad = p.getPrecioUnitario() != null ? " [" + p.getPrecioUnitario() + "]" : "";
                    return String.format("- %s (x%d, categoría: %s%s)",
                        p.getNombre(), p.getCantidad(), p.getSlugCategoria(), unidad);
                })
                .collect(Collectors.joining("\n"));

        String prompt = String.format("""
            Eres un asistente experto en asados chilenos. Analiza la siguiente información y entrega recomendaciones breves y prácticas.

            Evento:
            - Asistentes: %d personas
            - Tipo de asado: %s
            - Presupuesto aproximado: $%s CLP

            Productos seleccionados hasta ahora:
            %s

            Responde en español con máximo 4 puntos cortos. Indica:
            1. Si la cantidad de carne es suficiente (estándar chileno: 300-400g por persona de carne principal)
            2. Si faltan categorías importantes (bebidas, ensaladas, insumos)
            3. Si el presupuesto es coherente con lo seleccionado
            4. Una sugerencia específica para mejorar la selección

            Sé directo y usa el contexto chileno. No uses markdown, solo texto plano con viñetas (•).
            """,
            req.getAsistentes(),
            req.getTipoAsado(),
            String.format("%,d", req.getPresupuesto()),
            productosTexto
        );

        return llamarClaude(prompt);
    }

    public IaResponseDTO analizarCotizacion(CotizacionIaRequest req) {
        String cotizacionesTexto = req.getCotizaciones() == null || req.getCotizaciones().isEmpty()
            ? "Sin cotizaciones disponibles."
            : req.getCotizaciones().stream()
                .map(c -> String.format("- %s: $%s CLP", c.getComercio(), String.format("%,.0f", c.getTotal())))
                .collect(Collectors.joining("\n"));

        String productosTexto = req.getProductos() == null || req.getProductos().isEmpty()
            ? "Sin detalle."
            : req.getProductos().stream()
                .map(p -> String.format("- %s x%d (%s)", p.getNombre(), p.getCantidad(), p.getSlugCategoria()))
                .collect(Collectors.joining("\n"));

        boolean tienePresupuesto = req.getPresupuesto() > 0;
        String contextoPresupuesto = tienePresupuesto
            ? String.format("presupuesto $%s CLP", String.format("%,d", req.getPresupuesto()))
            : "sin presupuesto definido";

        String instruccionPresupuesto = tienePresupuesto
            ? "3. Si el total supera el presupuesto, sugiere qué reducir"
            : "3. Indica si el total es razonable para un asado chileno de esa cantidad de personas";

        String prompt = String.format("""
            Eres un asistente experto en compras para asados chilenos. Analiza las cotizaciones y entrega una recomendación clara.

            Evento: %d personas, asado %s, %s

            Productos seleccionados:
            %s

            Cotizaciones por comercio:
            %s

            Responde en español con máximo 3 puntos usando solo texto plano con viñetas (•). Indica:
            1. Qué comercio recomiendas y por qué (el más económico o mejor relación calidad-precio)
            2. Si conviene dividir la compra entre distintos comercios (ej: carnes en uno, bebidas en otro)
            %s

            Sé específico con los nombres de los comercios. No uses markdown.
            """,
            req.getAsistentes(),
            req.getTipoAsado(),
            contextoPresupuesto,
            productosTexto,
            cotizacionesTexto,
            instruccionPresupuesto
        );

        return llamarClaude(prompt);
    }

    private IaResponseDTO llamarClaude(String prompt) {
        try {
            Map<String, Object> body = Map.of(
                "model", MODEL,
                "max_tokens", 600,
                "messages", List.of(
                    Map.of("role", "user", "content", prompt)
                )
            );

            String bodyJson = mapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(API_URL))
                .header("Content-Type", "application/json")
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                return new IaResponseDTO("No se pudo obtener recomendaciones en este momento.", false);
            }

            Map<?, ?> responseMap = mapper.readValue(response.body(), Map.class);
            List<?> content = (List<?>) responseMap.get("content");
            Map<?, ?> firstBlock = (Map<?, ?>) content.get(0);
            String texto = (String) firstBlock.get("text");

            return new IaResponseDTO(texto, true);

        } catch (Exception e) {
            return new IaResponseDTO("No se pudo obtener recomendaciones en este momento.", false);
        }
    }
}