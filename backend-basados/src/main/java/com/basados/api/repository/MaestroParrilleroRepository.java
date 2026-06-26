package com.basados.api.repository;

import com.basados.api.entity.MaestroParrillero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MaestroParrilleroRepository extends JpaRepository<MaestroParrillero, Long> {

    // Maestros aprobados Y disponibles para contratar (vista pública)
    @Query("SELECT m FROM MaestroParrillero m WHERE m.estadoSolicitud = 'APROBADO' AND m.disponibilidad = true ORDER BY m.puntuacion DESC")
    List<MaestroParrillero> findAllDisponibles();

    // Panel admin: filtrar por estado de solicitud
    @Query("SELECT m FROM MaestroParrillero m WHERE m.estadoSolicitud = :estado ORDER BY m.idMaestro DESC")
    List<MaestroParrillero> findAllByEstadoSolicitud(@Param("estado") String estado);
}