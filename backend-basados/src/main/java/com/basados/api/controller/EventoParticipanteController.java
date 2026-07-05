package com.basados.api.controller;

import com.basados.api.dto.EventoParticipanteRequestDTO;
import com.basados.api.dto.EventoParticipanteResponseDTO;
import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoParticipante;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.EventoParticipanteRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evento-participantes")
public class EventoParticipanteController {

    private final EventoParticipanteRepository repository;
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    public EventoParticipanteController(
            EventoParticipanteRepository repository,
            EventoRepository eventoRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.repository = repository;
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<EventoParticipanteResponseDTO> listar() {
        return repository.findAll().stream()
            .map(this::toResponseDTO)
            .toList();
    }

    @PostMapping
    public EventoParticipanteResponseDTO crear(@Valid @RequestBody EventoParticipanteRequestDTO dto) {
        Evento evento = eventoRepository.findById(UUID.fromString(dto.getIdEvento())).orElseThrow();
        Usuario usuario = usuarioRepository.findById(UUID.fromString(dto.getIdUsuario())).orElseThrow();

        EventoParticipante ep = new EventoParticipante();
        ep.setIdEventoParticipante(UUID.randomUUID());
        ep.setEvento(evento);
        ep.setUsuario(usuario);
        ep.setRol(dto.getRol());
        ep.setAporte(dto.getAporte());
        ep.setAsistencia(dto.getAsistencia());
        ep.setFechaUnion(LocalDateTime.now());

        return toResponseDTO(repository.save(ep));
    }

    private EventoParticipanteResponseDTO toResponseDTO(EventoParticipante ep) {
        return new EventoParticipanteResponseDTO(
            ep.getIdEventoParticipante(),
            ep.getEvento() != null ? ep.getEvento().getIdEvento() : null,
            ep.getUsuario() != null ? ep.getUsuario().getIdUsuario() : null,
            ep.getUsuario() != null ? ep.getUsuario().getNombre() : null,
            ep.getRol(),
            ep.getAporte(),
            ep.getAsistencia(),
            ep.getFechaUnion()
        );
    }
}
