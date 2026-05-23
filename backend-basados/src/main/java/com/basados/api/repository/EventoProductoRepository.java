package com.basados.api.repository;

import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoProducto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventoProductoRepository extends JpaRepository<EventoProducto, UUID> {
    List<EventoProducto> findByEvento(Evento evento);
}