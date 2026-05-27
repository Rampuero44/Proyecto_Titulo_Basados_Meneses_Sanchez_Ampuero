package com.basados.api.repository;

import com.basados.api.entity.MaestroParrillero;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MaestroParrilleroRepository extends JpaRepository<MaestroParrillero, Long> {

    @Query("SELECT m FROM MaestroParrillero m WHERE m.disponibilidad = true ORDER BY m.puntuacion DESC")
    List<MaestroParrillero> findAllDisponibles();
}