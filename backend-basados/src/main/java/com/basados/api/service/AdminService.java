package com.basados.api.service;

import com.basados.api.dto.AdminMetricasDTO;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.EventoProductoRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class AdminService {

    private static final int TOP_PRODUCTOS_LIMITE = 10;

    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final EventoProductoRepository eventoProductoRepository;

    public AdminService(
            UsuarioRepository usuarioRepository,
            EventoRepository eventoRepository,
            EventoProductoRepository eventoProductoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.eventoProductoRepository = eventoProductoRepository;
    }

    @Transactional(readOnly = true)
    public AdminMetricasDTO obtenerMetricas() {
        verificarRolAdmin();

        long totalUsuarios = usuarioRepository.count();

        var eventosPorEstado = eventoRepository.countEventosPorEstado();

        Pageable top10 = PageRequest.of(0, TOP_PRODUCTOS_LIMITE);
        var productosMasSeleccionados = eventoProductoRepository.findProductosMasSeleccionados(top10);

        return new AdminMetricasDTO(totalUsuarios, eventosPorEstado, productosMasSeleccionados);
    }

    private void verificarRolAdmin() {
        Object principal = SecurityContextHolder.getContext().getAuthentication() != null
            ? SecurityContextHolder.getContext().getAuthentication().getPrincipal()
            : null;

        if (principal == null || "anonymousUser".equals(principal)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }

        UUID userId;
        try {
            userId = UUID.fromString(principal.toString());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token inválido");
        }

        Usuario usuario = usuarioRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        if (!"admin".equalsIgnoreCase(usuario.getRol())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acceso restringido a administradores");
        }
    }
}