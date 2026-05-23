package com.basados.api.controller;

import com.basados.api.entity.HistorialPrecio;
import com.basados.api.entity.Producto;
import com.basados.api.repository.HistorialPrecioRepository;
import com.basados.api.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/historial-precios")
@CrossOrigin(origins = "*")
public class HistorialPrecioController {

    private final HistorialPrecioRepository historialPrecioRepository;
    private final ProductoRepository productoRepository;

    public HistorialPrecioController(
            HistorialPrecioRepository historialPrecioRepository,
            ProductoRepository productoRepository
    ) {
        this.historialPrecioRepository = historialPrecioRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping("/producto/{idProducto}")
    public List<HistorialPrecio> listarPorProducto(@PathVariable Long idProducto) {
        Producto producto = productoRepository.findById(idProducto).orElseThrow();
        return historialPrecioRepository.findByProductoOrderByFechaScrapingDesc(producto);
    }
}