package com.basados.api.controller;

import com.basados.api.dto.ProductoResponseDTO;
import com.basados.api.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<ProductoResponseDTO> listarProductos() {
        return productoRepository.findAllActivosConPrecioMinimo();
    }
}
