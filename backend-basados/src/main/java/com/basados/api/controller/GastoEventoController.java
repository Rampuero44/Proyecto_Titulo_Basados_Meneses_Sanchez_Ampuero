package com.basados.api.controller;

import com.basados.api.entity.GastoEvento;
import com.basados.api.repository.GastoEventoRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gastos")
@CrossOrigin(origins = "*")
public class GastoEventoController {

    private final GastoEventoRepository gastoEventoRepository;

    public GastoEventoController(GastoEventoRepository gastoEventoRepository) {
        this.gastoEventoRepository = gastoEventoRepository;
    }

    @GetMapping
    public List<GastoEvento> listarGastos() {
        return gastoEventoRepository.findAll();
    }
}