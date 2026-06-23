package com.basados.api.service;

import com.basados.api.dto.AdminMetricasDTO;
import com.basados.api.dto.AuditoriaProductoDTO;
import com.basados.api.repository.AuditoriaProductoRepository;
import com.basados.api.repository.EventoProductoRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminService {

    private static final int TOP_PRODUCTOS_LIMITE = 10;
    private static final int FEED_AUDITORIA_LIMITE = 20;

    private final UsuarioRepository usuarioRepository;
    private final EventoRepository eventoRepository;
    private final EventoProductoRepository eventoProductoRepository;
    private final AuditoriaProductoRepository auditoriaProductoRepository;

    public AdminService(
            UsuarioRepository usuarioRepository,
            EventoRepository eventoRepository,
            EventoProductoRepository eventoProductoRepository,
            AuditoriaProductoRepository auditoriaProductoRepository
    ) {
        this.usuarioRepository = usuarioRepository;
        this.eventoRepository = eventoRepository;
        this.eventoProductoRepository = eventoProductoRepository;
        this.auditoriaProductoRepository = auditoriaProductoRepository;
    }

    @Transactional(readOnly = true)
    public AdminMetricasDTO obtenerMetricas() {
        long totalUsuarios = usuarioRepository.count();

        var eventosPorEstado = eventoRepository.countEventosPorEstado();

        Pageable top10 = PageRequest.of(0, TOP_PRODUCTOS_LIMITE);
        var productosMasSeleccionados = eventoProductoRepository.findProductosMasSeleccionados(top10);

        return new AdminMetricasDTO(totalUsuarios, eventosPorEstado, productosMasSeleccionados);
    }

    @Transactional(readOnly = true)
    public List<AuditoriaProductoDTO> obtenerFeedAuditoriaProductos() {
        Pageable top20 = PageRequest.of(0, FEED_AUDITORIA_LIMITE);
        return auditoriaProductoRepository.findFeedReciente(top20);
    }
}