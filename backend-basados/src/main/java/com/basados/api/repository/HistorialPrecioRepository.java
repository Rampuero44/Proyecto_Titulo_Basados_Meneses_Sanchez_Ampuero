package com.basados.api.repository;

import com.basados.api.entity.HistorialPrecio;
import com.basados.api.entity.Producto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HistorialPrecioRepository
        extends JpaRepository<HistorialPrecio, Long> {

    Optional<HistorialPrecio>
    findTopByProductoOrderByFechaScrapingDesc(
            Producto producto
    );
}