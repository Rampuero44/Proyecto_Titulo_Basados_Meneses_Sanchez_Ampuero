package com.basados.api.controller;

import com.basados.api.dto.EventoParticipanteRequestDTO;
import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoParticipante;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.EventoParticipanteRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/evento-participantes")
@CrossOrigin(origins = "*")
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
    public List<EventoParticipante> listar() {
        return repository.findAll();
    }

    @PostMapping
    public EventoParticipante crear(
            @RequestBody EventoParticipanteRequestDTO dto
    ) {

        Evento evento = eventoRepository.findById(dto.getIdEvento())
                .orElseThrow();

        Usuario usuario = usuarioRepository.findById(dto.getIdUsuario())
                .orElseThrow();

        EventoParticipante eventoParticipante = new EventoParticipante();

        eventoParticipante.setEvento(evento);
        eventoParticipante.setUsuario(usuario);
        eventoParticipante.setRol(dto.getRol());
        eventoParticipante.setAporte(dto.getAporte());
        eventoParticipante.setAsistencia(dto.getAsistencia());
        eventoParticipante.setFechaUnion(LocalDateTime.now());

        return repository.save(eventoParticipante);
    }
}