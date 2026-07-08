package com.basados.api.service;

import com.basados.api.dto.ContratacionRequest;
import com.basados.api.dto.ContratacionResponse;
import com.basados.api.entity.ContratacionAsador;
import com.basados.api.entity.MaestroParrillero;
import com.basados.api.repository.ContratacionRepository;
import com.basados.api.repository.MaestroParrilleroRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ContratacionService {

    private final ContratacionRepository contratacionRepository;
    private final MaestroParrilleroRepository maestroRepository;

    public ContratacionService(
            ContratacionRepository contratacionRepository,
            MaestroParrilleroRepository maestroRepository
    ) {
        this.contratacionRepository = contratacionRepository;
        this.maestroRepository = maestroRepository;
    }

    @Transactional
    public ContratacionResponse crear(ContratacionRequest request) {
        MaestroParrillero maestro = maestroRepository.findById(request.getIdMaestro())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Maestro asador no encontrado"));

        if (!"APROBADO".equals(maestro.getEstadoSolicitud()) || !Boolean.TRUE.equals(maestro.getDisponibilidad())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El maestro asador no está disponible para contrataciones");
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
            } catch (IllegalArgumentException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El formato del idEvento no es válido");
            }
        }

        ContratacionAsador guardada = contratacionRepository.save(contratacion);
        return toResponse(guardada);
    }

    @Transactional(readOnly = true)
    public List<ContratacionResponse> listarPorEvento(String idEvento) {
        UUID uuid;
        try {
            uuid = UUID.fromString(idEvento);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "idEvento con formato inválido");
        }

        return contratacionRepository.findByIdEvento(uuid)
            .stream()
            .map(this::toResponse)
            .toList();
    }

    private ContratacionResponse toResponse(ContratacionAsador c) {
        String nombre = c.getMaestro().getUsuario() != null
            ? c.getMaestro().getUsuario().getNombre() + " " + c.getMaestro().getUsuario().getApellido()
            : "Maestro asador";

        return new ContratacionResponse(
            c.getIdContratacion(),
            nombre,
            c.getValorAcordado(),
            c.getEstado(),
            c.getFechaContratacion()
        );
    }
}