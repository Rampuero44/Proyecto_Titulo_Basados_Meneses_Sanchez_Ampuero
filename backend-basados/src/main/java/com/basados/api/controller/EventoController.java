package com.basados.api.controller;

import com.basados.api.dto.EventoDetalleDTO;
import com.basados.api.dto.EventoRequestDTO;
import com.basados.api.dto.EventoResponseDTO;
import com.basados.api.service.EventoService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    public List<EventoResponseDTO> listarEventos() {
        return eventoService.listarEventos();
    }

    @GetMapping("/{id}/detalle")
    public EventoDetalleDTO obtenerDetalle(@PathVariable String id) {
        return eventoService.obtenerDetalle(id);
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<EventoResponseDTO> listarPorUsuario(@PathVariable String idUsuario) {
        return eventoService.listarPorUsuario(idUsuario);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) {
        eventoService.eliminar(id);
    }

    @GetMapping("/borrador/{idUsuario}")
    public EventoResponseDTO obtenerBorrador(@PathVariable String idUsuario) {
        return eventoService.obtenerBorrador(idUsuario);
    }

    @PostMapping
    public EventoResponseDTO crear(@RequestBody EventoRequestDTO dto) {
        return eventoService.crear(dto);
    }

    @PutMapping("/{id}")
    public EventoResponseDTO actualizar(@PathVariable String id, @RequestBody EventoRequestDTO dto) {
        return eventoService.actualizar(id, dto);
    }
}
