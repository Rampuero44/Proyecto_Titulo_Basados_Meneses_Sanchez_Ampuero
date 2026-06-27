package com.basados.api.repository;

import com.basados.api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {

    Optional<Usuario> findByCorreo(String correo);

    @Query("SELECT u.rol, COUNT(u) FROM Usuario u GROUP BY u.rol ORDER BY COUNT(u) DESC")
    List<Object[]> countUsuariosPorRol();

    @Query("""
        SELECT FUNCTION('TO_CHAR', u.fechaRegistro, 'YYYY-MM') AS mes, COUNT(u)
        FROM Usuario u
        WHERE u.fechaRegistro IS NOT NULL
        GROUP BY FUNCTION('TO_CHAR', u.fechaRegistro, 'YYYY-MM')
        ORDER BY mes DESC
    """)
    List<Object[]> countRegistrosPorMes();

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.activo = true")
    long countActivos();

    @Query("SELECT COUNT(u) FROM Usuario u WHERE u.activo = false")
    long countInactivos();
}