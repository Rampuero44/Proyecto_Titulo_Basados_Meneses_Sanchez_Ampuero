package com.basados.api.controller;

import com.basados.api.dto.EventoRequestDTO;
import com.basados.api.dto.EventoResponseDTO;
import com.basados.api.entity.Evento;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    public EventoController(
            EventoRepository eventoRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @GetMapping
    public List<EventoResponseDTO> listarEventos() {

        List<Evento> eventos = eventoRepository.findAll();

        return eventos.stream().map(evento ->

            new EventoResponseDTO(

                evento.getIdEvento(),

                evento.getNombre(),

                evento.getDescripcion(),

                evento.getFechaEvento(),

                evento.getDireccion(),

                evento.getPresupuesto(),

                evento.getCantidadPersonas(),

                evento.getEstado(),

                evento.getOrganizador() != null
                    ? evento.getOrganizador().getNombre()
                    : null

            )

        ).toList();
    }

    @PostMapping
    public Evento crear(
            @RequestBody EventoRequestDTO dto
    ) {

        Usuario organizador = usuarioRepository
                .findById(dto.getIdOrganizador())
                .orElseThrow();

        Evento evento = new Evento();

        evento.setNombre(dto.getNombre());
        evento.setDescripcion(dto.getDescripcion());
        evento.setFechaEvento(dto.getFechaEvento());
        evento.setDireccion(dto.getDireccion());
        evento.setPresupuesto(dto.getPresupuesto());
        evento.setCantidadPersonas(dto.getCantidadPersonas());
        evento.setEstado(dto.getEstado());

        evento.setActivo(true);

        evento.setFechaCreacion(LocalDateTime.now());

        evento.setOrganizador(organizador);

        evento.setUsuario(organizador);

        return eventoRepository.save(evento);
    }
}