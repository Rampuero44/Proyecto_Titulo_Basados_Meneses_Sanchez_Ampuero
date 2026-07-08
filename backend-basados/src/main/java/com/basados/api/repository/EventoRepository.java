package com.basados.api.repository;

import com.basados.api.dto.AdminMetricasDTO;
import com.basados.api.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface EventoRepository extends JpaRepository<Evento, UUID> {

    List<Evento> findByOrganizador_IdUsuarioAndEstado(UUID idUsuario, String estado);

    List<Evento> findByOrganizador_IdUsuarioOrderByFechaCreacionDesc(UUID idUsuario);

    List<Evento> findByActivoTrue();

    @Query("""
        SELECT new com.basados.api.dto.AdminMetricasDTO$EventosPorEstadoDTO(
            e.estado,
            COUNT(e)
        )
        FROM Evento e
        WHERE e.activo = true
        GROUP BY e.estado
    """)
    List<AdminMetricasDTO.EventosPorEstadoDTO> countEventosPorEstado();
}