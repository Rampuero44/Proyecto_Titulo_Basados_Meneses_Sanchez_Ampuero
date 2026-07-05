package com.basados.api.repository;

import com.basados.api.dto.AuditoriaProductoDTO;
import com.basados.api.entity.AuditoriaProducto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AuditoriaProductoRepository extends JpaRepository<AuditoriaProducto, Long> {

    @Query("""
        SELECT new com.basados.api.dto.AuditoriaProductoDTO(
            a.idAuditoria,
            p.nombre,
            a.accion,
            a.fechaCambio,
            a.usuarioResponsable
        )
        FROM AuditoriaProducto a, Producto p
        WHERE a.idProducto = p.idProducto
        ORDER BY a.fechaCambio DESC
    """)
    java.util.List<AuditoriaProductoDTO> findFeedReciente(Pageable pageable);
}
