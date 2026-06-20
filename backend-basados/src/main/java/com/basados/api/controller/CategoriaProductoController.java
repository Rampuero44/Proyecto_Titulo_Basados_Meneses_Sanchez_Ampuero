package com.basados.api.controller;

import com.basados.api.entity.CategoriaProducto;
import com.basados.api.repository.CategoriaProductoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
public class CategoriaProductoController {

    private final CategoriaProductoRepository categoriaProductoRepository;

    public CategoriaProductoController(CategoriaProductoRepository categoriaProductoRepository) {
        this.categoriaProductoRepository = categoriaProductoRepository;
    }

    @GetMapping
    public List<CategoriaProducto> listarCategorias() {
        return categoriaProductoRepository.findAll();
    }
}