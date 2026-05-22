package com.basados.api.repository;

import com.basados.api.entity.Comercio;
import com.basados.api.entity.HistorialPrecio;
import com.basados.api.entity.Producto;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface HistorialPrecioRepository
        extends JpaRepository<HistorialPrecio, Long> {

    Optional<HistorialPrecio>
    findTopByProductoOrderByFechaScrapingDesc(
            Producto producto
    );

    @Query("""
        SELECT hp FROM HistorialPrecio hp
        WHERE hp.producto = :producto
          AND hp.comercio = :comercio
          AND hp.fechaScraping = (
              SELECT MAX(hp2.fechaScraping)
              FROM HistorialPrecio hp2
              WHERE hp2.producto = :producto
                AND hp2.comercio = :comercio
          )
        ORDER BY hp.idHistorial DESC
    """)
    Optional<HistorialPrecio> findPrecioMasRecientePorComercio(
            @Param("producto") Producto producto,
            @Param("comercio") Comercio comercio
    );

    @Query("SELECT DISTINCT hp.comercio FROM HistorialPrecio hp WHERE hp.disponible = true")
    List<Comercio> findComerciosActivos();
}