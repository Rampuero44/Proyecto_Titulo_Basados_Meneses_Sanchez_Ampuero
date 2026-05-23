package com.basados.api.controller;

import com.basados.api.entity.Evento;
import com.basados.api.entity.GastoEvento;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.GastoEventoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoEventoController {

    private final GastoEventoRepository gastoEventoRepository;
    private final EventoRepository eventoRepository;

    public GastoEventoController(
            GastoEventoRepository gastoEventoRepository,
            EventoRepository eventoRepository
    ) {
        this.gastoEventoRepository = gastoEventoRepository;
        this.eventoRepository = eventoRepository;
    }

    @GetMapping("/evento/{idEvento}")
    public List<GastoEvento> listarPorEvento(@PathVariable String idEvento) {
        Evento evento = eventoRepository.findById(UUID.fromString(idEvento)).orElseThrow();
        return gastoEventoRepository.findByEvento(evento);
    }
}