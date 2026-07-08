package com.basados.api.controller;

import com.basados.api.dto.EventoParticipanteRequestDTO;
import com.basados.api.dto.EventoParticipanteResponseDTO;
import com.basados.api.service.EventoParticipanteService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evento-participantes")
public class EventoParticipanteController {

    private final EventoParticipanteService service;

    public EventoParticipanteController(EventoParticipanteService service) {
        this.service = service;
    }

    @GetMapping
    public List<EventoParticipanteResponseDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public EventoParticipanteResponseDTO crear(@Valid @RequestBody EventoParticipanteRequestDTO dto) {
        return service.crear(dto);
    }
}