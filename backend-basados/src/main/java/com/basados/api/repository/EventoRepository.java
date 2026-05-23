package com.basados.api.repository;

import com.basados.api.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventoRepository extends JpaRepository<Evento, UUID> {
    List<Evento> findByOrganizador_IdUsuarioAndEstado(UUID idUsuario, String estado);
    List<Evento> findByOrganizador_IdUsuarioOrderByFechaCreacionDesc(UUID idUsuario);
}