package com.basados.api.service.ia;

import com.basados.api.dto.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(IaService.class);

    @Value("${anthropic.api.key}")
    private String apiKey;

    private static final String API_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-haiku-4-5-20251001";
    private final ObjectMapper mapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public IaResponseDTO generarSugerencias(SugerenciasRequest req) {
        boolean tieneProductos = req.getProductos() != null && !req.getProductos().isEmpty();
        boolean tienePresupuesto = req.getPresupuesto() > 0;

        String productosTexto = !tieneProductos
            ? "Ninguno seleccionado aún."
            : req.getProductos().stream()
                .map(p -> {
                    String unidad = p.getPrecioUnitario() != null ? " [" + p.getPrecioUnitario() + "]" : "";
                    String peso = "";
                    if (p.getPesoGramos() != null && p.getUnidadFormato() != null) {
                        if ("g".equals(p.getUnidadFormato())) {
                            peso = p.getPesoGramos() >= 1000
                                ? String.format(" [%.1f kg]", p.getPesoGramos() / 1000.0)
                                : String.format(" [%d g]", p.getPesoGramos());
                        } else if ("ml".equals(p.getUnidadFormato())) {
                            peso = p.getPesoGramos() >= 1000
                                ? String.format(" [%.1f L]", p.getPesoGramos() / 1000.0)
                                : String.format(" [%d ml]", p.getPesoGramos());
                        } else if ("un".equals(p.getUnidadFormato())) {
                            peso = " [unidad/pack]";
                        }
                    }
                    return String.format("- %s (x%d, categoría: %s%s%s)",
                        p.getNombre(), p.getCantidad(), p.getSlugCategoria(), peso, unidad);
                })
                .collect(Collectors.joining("\n"));

        String contextoPresupuesto = tienePresupuesto
                ? String.format("$%s CLP", String.format("%,d", req.getPresupuesto()))
                : "no definido";

        String instruccionPresupuesto = tienePresupuesto
                ? String.format("""
                        • PRESUPUESTO: Indica en un punto separado y directo si el presupuesto de $%s CLP alcanza para lo seleccionado o si se va a quedar corto. Si sobra harto, dilo también. Solo el dato, sin rodeos.""",
                        String.format("%,d", req.getPresupuesto()))
                : "";

        String prompt;

        if (!tieneProductos && !tienePresupuesto) {
            prompt = String.format(
                """
                        Eres un maestro asador chileno con años de experiencia. Hablas directo y cercano, como un amigo que sabe lo que hace.

                        El usuario está armando un asado para %d personas (%s) pero todavía no ha agregado ningún producto.

                        Escribe UN solo mensaje motivacional corto (máximo 3 líneas) invitándolo a empezar por la carne. Sé específico: sugiere un corte concreto para comenzar. Usa viñeta (•). Sin markdown, solo texto plano.
                        """,
                    req.getAsistentes(),
                    req.getTipoAsado());

        } else if (!tieneProductos && tienePresupuesto) {
            prompt = String.format(
                """
                        Eres un maestro asador chileno con años de experiencia. Hablas directo y cercano, como un amigo que sabe lo que hace.

                        El usuario está armando un asado para %d personas (%s) con un presupuesto de $%s CLP, pero todavía no ha agregado ningún producto.

                        Responde con 2 puntos usando viñetas (•). Sin markdown, solo texto plano:
                        • Primero, dile si el presupuesto parece suficiente, justo o ajustado para esa cantidad de personas en un asado chileno estándar. Sé directo con los números.
                        • Luego, invítalo a empezar agregando la carne y sugiere un corte concreto para comenzar.
                        """,
                    req.getAsistentes(),
                    req.getTipoAsado(),
                    String.format("%,d", req.getPresupuesto()));

        } else {
            prompt = String.format(
                """
                        Eres un maestro asador chileno con años de experiencia. Hablas de forma directa y cercana, como si le aconsejaras a un amigo que está organizando su asado. Usas algún modismo chileno de vez en cuando pero sin exagerar. Sin rodeos, sin formalidades.

                        Evento:
                        - Asistentes: %d personas
                        - Tipo de asado: %s
                        - Presupuesto: %s

                        Productos seleccionados hasta ahora:
                        %s

                        CÁLCULO DE CARNE: Para evaluar si alcanza la carne, suma (cantidad × peso_gramos) de cada producto cárnico y divídelo por el número de asistentes. El estándar chileno es 300-400g por persona. Si el resultado está bajo ese rango, dilo con los números concretos. Ojo que el vacuno se encoge bastante en la parrilla. Para carnes sin peso indicado, asume 1000g por unidad.

                        Responde con máximo 4 puntos cortos usando viñetas (•). Sin markdown, solo texto plano. Indica:
                        • Si la carne alcanza para todos — calcula los gramos por persona y dilo directo.
                        • Si falta algo que no puede faltar en un asado (bebidas, pan, ensalada, insumos) — específico, no genérico.
                        • Un consejo concreto y accionable para mejorar este asado en particular.
                        %s
                        """,
                    req.getAsistentes(),
                    req.getTipoAsado(),
                    contextoPresupuesto,
                    productosTexto,
                    instruccionPresupuesto);
        }

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
                .map(p -> {
                    String peso = "";
                    if (p.getPesoGramos() != null && p.getUnidadFormato() != null) {
                        if ("g".equals(p.getUnidadFormato())) {
                            peso = p.getPesoGramos() >= 1000
                                ? String.format(" [%.1f kg]", p.getPesoGramos() / 1000.0)
                                : String.format(" [%d g]", p.getPesoGramos());
                        } else if ("ml".equals(p.getUnidadFormato())) {
                            peso = p.getPesoGramos() >= 1000
                                ? String.format(" [%.1f L]", p.getPesoGramos() / 1000.0)
                                : String.format(" [%d ml]", p.getPesoGramos());
                        }
                    }
                    return String.format("- %s x%d (%s%s)", p.getNombre(), p.getCantidad(), p.getSlugCategoria(), peso);
                })
                .collect(Collectors.joining("\n"));


        boolean tienePresupuesto = req.getPresupuesto() > 0;
        String contextoPresupuesto = tienePresupuesto
                ? String.format("presupuesto $%s CLP", String.format("%,d", req.getPresupuesto()))
                : "sin presupuesto definido";

        String instruccionPresupuesto = tienePresupuesto
                ? "3. Si el total supera el presupuesto, sugiere qué reducir"
                : "3. Indica si el total es razonable para un asado chileno de esa cantidad de personas";

        String prompt = String.format(
                """
                        Eres un maestro asador chileno con años de experiencia que también sabe dónde comprar bien. Hablas directo, como un amigo que ya pasó por esto muchas veces. Sin formalidades.

                        Evento: %d personas, asado %s, %s

                        Productos seleccionados:
                        %s

                        Cotizaciones por comercio:
                        %s

                        Responde con máximo 3 puntos usando viñetas (•). Sin markdown, solo texto plano. Indica:
                        1. Qué comercio conviene y cuánto se ahorra respecto al más caro — menciona el monto concreto en pesos.
                        2. Si vale la pena dividir la compra entre comercios y qué comprar en cada uno — solo si la diferencia justifica el viaje.
                        %s
                        """,
                req.getAsistentes(),
                req.getTipoAsado(),
                contextoPresupuesto,
                productosTexto,
                cotizacionesTexto,
                instruccionPresupuesto);

        return llamarClaude(prompt);
    }

    private IaResponseDTO llamarClaude(String prompt) {
        try {
            Map<String, Object> body = Map.of(
                    "model", MODEL,
                    "max_tokens", 600,
                    "messages", List.of(
                            Map.of("role", "user", "content", prompt)));

            String bodyJson = mapper.writeValueAsString(body);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL))
                    .header("Content-Type", "application/json")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", "2023-06-01")
                    .POST(HttpRequest.BodyPublishers.ofString(bodyJson))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            int statusCode = response.statusCode();

            if (statusCode != 200) {
                if (statusCode == 401) {
                    log.error("Error al llamar a la API de Anthropic: API key inválida o no autorizada (401)");
                    return new IaResponseDTO("Servicio de IA no disponible: credenciales inválidas.", false);
                } else if (statusCode == 429) {
                    log.error("Error al llamar a la API de Anthropic: límite de uso alcanzado (429)");
                    return new IaResponseDTO("El servicio de IA está saturado en este momento. Intenta nuevamente en unos minutos.", false);
                } else if (statusCode >= 500) {
                    log.error("Error al llamar a la API de Anthropic: error del servicio ({})", statusCode);
                    return new IaResponseDTO("El servicio de IA no está disponible en este momento. Intenta más tarde.", false);
                } else {
                    log.error("Error al llamar a la API de Anthropic: status {}", statusCode);
                    return new IaResponseDTO("No se pudo obtener recomendaciones en este momento.", false);
                }
            }

            Map<?, ?> responseMap = mapper.readValue(response.body(), Map.class);
            List<?> content = (List<?>) responseMap.get("content");
            Map<?, ?> firstBlock = (Map<?, ?>) content.get(0);
            String texto = (String) firstBlock.get("text");

            int tokensConsumidos = 0;
            Object usageObj = responseMap.get("usage");
            if (usageObj instanceof Map<?, ?> usage) {
                Object inputTokens = usage.get("input_tokens");
                Object outputTokens = usage.get("output_tokens");
                if (inputTokens instanceof Number) {
                    tokensConsumidos += ((Number) inputTokens).intValue();
                }
                if (outputTokens instanceof Number) {
                    tokensConsumidos += ((Number) outputTokens).intValue();
                }
            }

            return new IaResponseDTO(texto, true, tokensConsumidos);

        } catch (java.net.http.HttpTimeoutException e) {
            log.error("Timeout al llamar a la API de Anthropic", e);
            return new IaResponseDTO("El servicio de IA demoró demasiado en responder. Intenta nuevamente.", false);
        } catch (java.io.IOException e) {
            log.error("Error de red al llamar a la API de Anthropic", e);
            return new IaResponseDTO("No fue posible conectarse al servicio de IA. Verifica tu conexión e intenta nuevamente.", false);
        } catch (Exception e) {
            log.error("Error al generar recomendaciones con Claude", e);
            return new IaResponseDTO("No se pudo obtener recomendaciones en este momento.", false);
        }
    }
}