package com.basados.api.controller;

import com.basados.api.entity.Comercio;
import com.basados.api.repository.ComercioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comercios")
public class ComercioController {

    private final ComercioRepository comercioRepository;

    public ComercioController(ComercioRepository comercioRepository) {
        this.comercioRepository = comercioRepository;
    }

    @GetMapping
    public List<Comercio> listarComercios() {
        return comercioRepository.findAll();
    }
}