package com.basados.api.config;

import com.basados.api.repository.UsuarioRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.math.BigInteger;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.AlgorithmParameters;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.ECParameterSpec;
import java.security.spec.ECPoint;
import java.security.spec.ECPublicKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.UUID;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final UsuarioRepository usuarioRepository;
    private final PublicKey publicKey;

    public JwtAuthFilter(
            @Value("${supabase.jwks.url}") String jwksUrl,
            UsuarioRepository usuarioRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.publicKey = cargarClavePublica(jwksUrl);
    }

    private PublicKey cargarClavePublica(String jwksUrl) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(jwksUrl))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            JsonNode jwks = new ObjectMapper().readTree(response.body());
            JsonNode keys = jwks.get("keys");

            if (keys == null || keys.isEmpty()) {
                log.error("[JWT] JWKS sin claves disponibles");
                return null;
            }

            for (JsonNode key : keys) {
                if ("EC".equals(key.path("kty").asText()) && "ES256".equals(key.path("alg").asText())) {
                    byte[] xBytes = Base64.getUrlDecoder().decode(key.path("x").asText());
                    byte[] yBytes = Base64.getUrlDecoder().decode(key.path("y").asText());

                    AlgorithmParameters params = AlgorithmParameters.getInstance("EC");
                    params.init(new ECGenParameterSpec("secp256r1"));
                    ECParameterSpec ecParams = params.getParameterSpec(ECParameterSpec.class);

                    ECPoint point = new ECPoint(
                            new BigInteger(1, xBytes),
                            new BigInteger(1, yBytes)
                    );

                    return KeyFactory.getInstance("EC")
                            .generatePublic(new ECPublicKeySpec(point, ecParams));
                }
            }

            log.error("[JWT] No se encontró clave EC/ES256 en el JWKS");
            return null;

        } catch (Exception e) {
            log.error("[JWT] Error cargando clave pública: {}", e.getMessage());
            return null;
        }
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (publicKey == null) {
            log.error("[JWT] Clave pública no disponible");
            SecurityContextHolder.clearContext();
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {
            Claims claims = Jwts.parser()
                    .verifyWith(publicKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            String sub = claims.getSubject();
            if (sub == null || sub.isBlank()) {
                filterChain.doFilter(request, response);
                return;
            }

            UUID userId = UUID.fromString(sub);

            String rol = usuarioRepository.findById(userId)
                    .map(u -> u.getRol() != null ? u.getRol().toUpperCase() : "USUARIO")
                    .orElse("USUARIO");

            List<SimpleGrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + rol)
            );

            SecurityContextHolder.getContext().setAuthentication(
                    new UsernamePasswordAuthenticationToken(sub, null, authorities)
            );

        } catch (JwtException e) {
            log.warn("[JWT] Token inválido o expirado: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        } catch (IllegalArgumentException e) {
            log.warn("[JWT] Sub inválido: {}", e.getMessage());
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}