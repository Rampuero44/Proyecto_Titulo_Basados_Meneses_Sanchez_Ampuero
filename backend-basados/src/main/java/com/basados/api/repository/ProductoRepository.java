package com.basados.api.repository;

import com.basados.api.dto.ProductoResponseDTO;
import com.basados.api.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    @Query("""
        SELECT new com.basados.api.dto.ProductoResponseDTO(
            p.idProducto,
            p.nombre,
            c.nombre,
            c.slug,
            m.nombre,
            p.calorias,
            p.alcoholico,
            p.imagenUrl,
            (SELECT MIN(
                CASE WHEN hp2.precioOferta IS NOT NULL
                     THEN hp2.precioOferta
                     ELSE hp2.precio
                END
             )
             FROM HistorialPrecio hp2
             WHERE hp2.producto.idProducto = p.idProducto
               AND hp2.disponible = true
               AND hp2.fechaScraping = (
                   SELECT MAX(hp3.fechaScraping)
                   FROM HistorialPrecio hp3
                   WHERE hp3.producto.idProducto = p.idProducto
                     AND hp3.comercio.idComercio = hp2.comercio.idComercio
               )
            ),
            (SELECT hp4.precioUnitario
             FROM HistorialPrecio hp4
             WHERE hp4.producto.idProducto = p.idProducto
               AND hp4.disponible = true
               AND hp4.precioUnitario IS NOT NULL
             ORDER BY hp4.fechaScraping DESC
             LIMIT 1
            )
        )
        FROM Producto p
        LEFT JOIN p.categoria c
        LEFT JOIN p.marca m
        WHERE p.activo = true
          OR p.activo IS NULL
        ORDER BY p.nombre ASC
    """)
    List<ProductoResponseDTO> findAllActivosConPrecioMinimo();
}