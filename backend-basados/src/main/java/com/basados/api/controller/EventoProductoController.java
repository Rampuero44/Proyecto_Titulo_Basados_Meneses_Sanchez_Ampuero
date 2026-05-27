package com.basados.api.controller;

import com.basados.api.dto.EventoProductoRequestDTO;
import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoProducto;
import com.basados.api.entity.HistorialPrecio;
import com.basados.api.entity.Producto;
import com.basados.api.repository.EventoProductoRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.HistorialPrecioRepository;
import com.basados.api.repository.ProductoRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evento-productos")
@CrossOrigin(origins = "*")
public class EventoProductoController {

    private final EventoProductoRepository repository;
    private final EventoRepository eventoRepository;
    private final ProductoRepository productoRepository;
    private final HistorialPrecioRepository historialPrecioRepository;

    public EventoProductoController(
            EventoProductoRepository repository,
            EventoRepository eventoRepository,
            ProductoRepository productoRepository,
            HistorialPrecioRepository historialPrecioRepository
    ) {
        this.repository = repository;
        this.eventoRepository = eventoRepository;
        this.productoRepository = productoRepository;
        this.historialPrecioRepository = historialPrecioRepository;
    }

    @GetMapping
    public List<EventoProducto> listar() {
        return repository.findAll();
    }

    @PostMapping
    public EventoProducto crear(@RequestBody EventoProductoRequestDTO dto) {
        Evento evento = eventoRepository.findById(UUID.fromString(dto.getIdEvento())).orElseThrow();
        Producto producto = productoRepository.findById(dto.getIdProducto()).orElseThrow();

        HistorialPrecio historial = null;
        if (dto.getIdHistorial() != null) {
            historial = historialPrecioRepository.findById(dto.getIdHistorial()).orElse(null);
        }

        EventoProducto ep = new EventoProducto();
        ep.setIdEventoProducto(UUID.randomUUID());
        ep.setEvento(evento);
        ep.setProducto(producto);
        ep.setCantidad(dto.getCantidad());
        ep.setHistorialPrecio(historial);
        ep.setSeleccionado(dto.getSeleccionado());

        return repository.save(ep);
    }
}