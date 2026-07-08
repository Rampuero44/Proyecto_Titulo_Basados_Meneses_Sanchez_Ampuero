package com.basados.api.repository;

import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoParticipante;
import com.basados.api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface EventoParticipanteRepository extends JpaRepository<EventoParticipante, UUID> {
    List<EventoParticipante> findByEvento(Evento evento);
    boolean existsByEventoAndUsuario(Evento evento, Usuario usuario);
}