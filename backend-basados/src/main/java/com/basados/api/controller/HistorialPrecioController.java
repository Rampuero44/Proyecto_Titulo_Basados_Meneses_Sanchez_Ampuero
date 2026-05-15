package com.basados.api.controller;

import com.basados.api.entity.HistorialPrecio;
import com.basados.api.repository.HistorialPrecioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-precios")
@CrossOrigin(origins = "*")
public class HistorialPrecioController {

    private final HistorialPrecioRepository historialPrecioRepository;

    public HistorialPrecioController(HistorialPrecioRepository historialPrecioRepository) {
        this.historialPrecioRepository = historialPrecioRepository;
    }

    @GetMapping
    public List<HistorialPrecio> listarHistorial() {
        return historialPrecioRepository.findAll();
    }
}