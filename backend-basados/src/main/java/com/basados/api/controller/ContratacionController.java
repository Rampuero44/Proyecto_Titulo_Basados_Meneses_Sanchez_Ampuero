package com.basados.api.controller;

import com.basados.api.dto.ContratacionRequest;
import com.basados.api.dto.ContratacionResponse;
import com.basados.api.entity.ContratacionAsador;
import com.basados.api.entity.MaestroParrillero;
import com.basados.api.repository.ContratacionRepository;
import com.basados.api.repository.MaestroParrilleroRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/contrataciones")
public class ContratacionController {

    private final ContratacionRepository contratacionRepository;
    private final MaestroParrilleroRepository maestroRepository;

    public ContratacionController(ContratacionRepository contratacionRepository,
                                   MaestroParrilleroRepository maestroRepository) {
        this.contratacionRepository = contratacionRepository;
        this.maestroRepository = maestroRepository;
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody ContratacionRequest request) {
        MaestroParrillero maestro = maestroRepository.findById(request.getIdMaestro())
            .orElse(null);

        if (maestro == null) {
            return ResponseEntity.badRequest().body("Maestro asador no encontrado");
        }

        ContratacionAsador contratacion = new ContratacionAsador();
        contratacion.setMaestro(maestro);
        contratacion.setValorAcordado(request.getValorAcordado() != null
            ? request.getValorAcordado()
            : maestro.getValorServicio());
        contratacion.setEstado("PENDIENTE");
        contratacion.setFechaContratacion(LocalDateTime.now());

        if (request.getIdEvento() != null && !request.getIdEvento().isBlank()) {
            try {
                contratacion.setIdEvento(UUID.fromString(request.getIdEvento()));
            } catch (IllegalArgumentException ignored) {}
        }

        ContratacionAsador guardada = contratacionRepository.save(contratacion);

        String nombre = maestro.getUsuario() != null
            ? maestro.getUsuario().getNombre() + " " + maestro.getUsuario().getApellido()
            : "Maestro asador";

        return ResponseEntity.ok(new ContratacionResponse(
            guardada.getIdContratacion(),
            nombre,
            guardada.getValorAcordado(),
            guardada.getEstado(),
            guardada.getFechaContratacion()
        ));
    }

    @GetMapping("/evento/{idEvento}")
    public ResponseEntity<List<ContratacionResponse>> getByEvento(@PathVariable String idEvento) {
        try {
            UUID uuid = UUID.fromString(idEvento);
            List<ContratacionResponse> contrataciones = contratacionRepository
                .findByIdEvento(uuid)
                .stream()
                .map(c -> {
                    String nombre = c.getMaestro().getUsuario() != null
                        ? c.getMaestro().getUsuario().getNombre() + " " + c.getMaestro().getUsuario().getApellido()
                        : "Maestro asador";
                    return new ContratacionResponse(
                        c.getIdContratacion(), nombre,
                        c.getValorAcordado(), c.getEstado(), c.getFechaContratacion()
                    );
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(contrataciones);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}