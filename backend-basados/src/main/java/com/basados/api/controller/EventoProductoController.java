package com.basados.api.controller;

import com.basados.api.dto.EventoProductoRequestDTO;
import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoProducto;
import com.basados.api.entity.Producto;
import com.basados.api.repository.EventoProductoRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.ProductoRepository;
import com.basados.api.entity.HistorialPrecio;
import com.basados.api.repository.HistorialPrecioRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public EventoProducto crear(
            @RequestBody EventoProductoRequestDTO dto) {

        Evento evento = eventoRepository.findById(dto.getIdEvento())
                .orElseThrow();

        Producto producto = productoRepository.findById(dto.getIdProducto())
                .orElseThrow();

        HistorialPrecio historialPrecio = historialPrecioRepository
                .findById(dto.getIdHistorial())
                .orElseThrow();

        EventoProducto eventoProducto = new EventoProducto();

        eventoProducto.setEvento(evento);
        eventoProducto.setProducto(producto);
        eventoProducto.setCantidad(dto.getCantidad());
        eventoProducto.setHistorialPrecio(historialPrecio);
        eventoProducto.setSeleccionado(dto.getSeleccionado());

        return repository.save(eventoProducto);
    }
}