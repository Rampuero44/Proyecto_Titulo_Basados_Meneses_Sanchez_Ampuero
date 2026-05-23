package com.basados.api.repository;

import com.basados.api.entity.GastoEvento;
import com.basados.api.entity.Evento;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GastoEventoRepository extends JpaRepository<GastoEvento, UUID> {
    List<GastoEvento> findByEvento(Evento evento);
}