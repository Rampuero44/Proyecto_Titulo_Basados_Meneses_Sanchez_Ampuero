package com.basados.api.repository;

import com.basados.api.entity.MaestroParrillero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MaestroParrilleroRepository extends JpaRepository<MaestroParrillero, Long> {

    @Query("SELECT m FROM MaestroParrillero m WHERE m.estadoSolicitud = 'APROBADO' AND m.disponibilidad = true ORDER BY m.puntuacion DESC")
    List<MaestroParrillero> findAllDisponibles();

    @Query("SELECT m FROM MaestroParrillero m WHERE m.estadoSolicitud = :estado ORDER BY m.idMaestro DESC")
    List<MaestroParrillero> findAllByEstadoSolicitud(@Param("estado") String estado);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM MaestroParrillero m WHERE m.usuario.idUsuario = :idUsuario AND m.estadoSolicitud = :estado")
    Optional<MaestroParrillero> findByUsuarioIdAndEstado(@Param("idUsuario") UUID idUsuario, @Param("estado") String estado);

    @Query("SELECT CASE WHEN COUNT(m) > 0 THEN true ELSE false END FROM MaestroParrillero m WHERE m.usuario.idUsuario = :idUsuario AND m.estadoSolicitud = :estado")
    boolean existsByUsuarioIdAndEstado(@Param("idUsuario") UUID idUsuario, @Param("estado") String estado);
}