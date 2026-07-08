package com.basados.api.service;

import com.basados.api.dto.EventoParticipanteRequestDTO;
import com.basados.api.dto.EventoParticipanteResponseDTO;
import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoParticipante;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.EventoParticipanteRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EventoParticipanteService {

    private final EventoParticipanteRepository repository;
    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    public EventoParticipanteService(
            EventoParticipanteRepository repository,
            EventoRepository eventoRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.repository = repository;
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<EventoParticipanteResponseDTO> listar() {
        return repository.findAll().stream()
            .map(this::toResponseDTO)
            .toList();
    }

    @Transactional
    public EventoParticipanteResponseDTO crear(EventoParticipanteRequestDTO dto) {
        UUID idEvento = UUID.fromString(dto.getIdEvento());
        UUID idUsuario = UUID.fromString(dto.getIdUsuario());

        Evento evento = eventoRepository.findById(idEvento)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado"));

        Usuario usuario = usuarioRepository.findById(idUsuario)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        boolean yaExiste = repository.existsByEventoAndUsuario(evento, usuario);
        if (yaExiste) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya es participante de este evento");
        }

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