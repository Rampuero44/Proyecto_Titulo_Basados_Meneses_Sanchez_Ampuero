package com.basados.api.repository;

import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoProducto;
import com.basados.api.dto.AdminMetricasDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface EventoProductoRepository extends JpaRepository<EventoProducto, UUID> {
    List<EventoProducto> findByEvento(Evento evento);

    @Query("""
        SELECT new com.basados.api.dto.AdminMetricasDTO$ProductoMasSeleccionadoDTO(
            ep.producto.nombre,
            COUNT(ep)
        )
        FROM EventoProducto ep
        WHERE ep.producto IS NOT NULL
        GROUP BY ep.producto.nombre
        ORDER BY COUNT(ep) DESC
    """)
    List<AdminMetricasDTO.ProductoMasSeleccionadoDTO> findProductosMasSeleccionados(Pageable pageable);
}