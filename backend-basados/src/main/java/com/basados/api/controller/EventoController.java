package com.basados.api.controller;

import com.basados.api.dto.EventoRequestDTO;
import com.basados.api.dto.EventoResponseDTO;
import com.basados.api.dto.EventoDetalleDTO;
import com.basados.api.entity.EventoParticipante;
import com.basados.api.entity.EventoProducto;
import com.basados.api.repository.EventoParticipanteRepository;
import com.basados.api.repository.EventoProductoRepository;
import com.basados.api.repository.ContratacionRepository;
import com.basados.api.entity.Evento;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.UsuarioRepository;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/eventos")
@CrossOrigin(origins = "*")
public class EventoController {

    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoParticipanteRepository participanteRepository;
    private final EventoProductoRepository productoEventoRepository;
    private final ContratacionRepository contratacionRepository;

    public EventoController(
            EventoRepository eventoRepository,
            UsuarioRepository usuarioRepository,
            EventoParticipanteRepository participanteRepository,
            EventoProductoRepository productoEventoRepository,
            ContratacionRepository contratacionRepository
    ) {
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.participanteRepository = participanteRepository;
        this.productoEventoRepository = productoEventoRepository;
        this.contratacionRepository = contratacionRepository;
    }

    @GetMapping
    public List<EventoResponseDTO> listarEventos() {
        return eventoRepository.findAll().stream().map(evento ->
            new EventoResponseDTO(
                evento.getIdEvento(),
                evento.getNombre(),
                evento.getDescripcion(),
                evento.getFechaEvento(),
                evento.getDireccion(),
                evento.getPresupuesto(),
                evento.getCantidadPersonas(),
                evento.getEstado(),
                evento.getOrganizador() != null ? evento.getOrganizador().getNombre() : null
            )
        ).toList();
    }

    @GetMapping("/{id}/detalle")
    public EventoDetalleDTO obtenerDetalle(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        Evento evento = eventoRepository.findById(uuid).orElseThrow();

        if ("BORRADOR".equals(evento.getEstado())) {
            throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND, "Evento no disponible");
        }

        EventoDetalleDTO dto = new EventoDetalleDTO();
        dto.setId(evento.getIdEvento());
        dto.setNombre(evento.getNombre());
        dto.setDescripcion(evento.getDescripcion());
        dto.setFechaEvento(evento.getFechaEvento());
        dto.setDireccion(evento.getDireccion());
        dto.setPresupuesto(evento.getPresupuesto());
        dto.setCantidadPersonas(evento.getCantidadPersonas());
        dto.setEstado(evento.getEstado());
        dto.setOrganizador(evento.getOrganizador() != null ? evento.getOrganizador().getNombre() : null);

        List<EventoProducto> productos = productoEventoRepository.findByEvento(evento);
        dto.setProductos(productos.stream().map(ep -> {
            EventoDetalleDTO.ProductoEventoDTO p = new EventoDetalleDTO.ProductoEventoDTO();
            p.setIdProducto(ep.getProducto() != null ? ep.getProducto().getIdProducto() : null);
            p.setNombre(ep.getProducto() != null ? ep.getProducto().getNombre() : "");
            p.setSlugCategoria(ep.getProducto() != null && ep.getProducto().getCategoria() != null
                ? ep.getProducto().getCategoria().getSlug() : null);
            p.setCantidad(ep.getCantidad());
            p.setSeleccionado(ep.getSeleccionado());
            if (ep.getHistorialPrecio() != null) {
                p.setPrecioUnitario(ep.getHistorialPrecio().getPrecioOferta() != null
                    ? ep.getHistorialPrecio().getPrecioOferta()
                    : ep.getHistorialPrecio().getPrecio());
                p.setPrecioUnitarioTexto(ep.getHistorialPrecio().getPrecioUnitario());
                p.setComercio(ep.getHistorialPrecio().getComercio() != null
                    ? ep.getHistorialPrecio().getComercio().getNombre() : null);
            }
            return p;
        }).toList());

        List<EventoParticipante> participantes = participanteRepository.findByEvento(evento);
        dto.setParticipantes(participantes.stream().map(ep -> {
            EventoDetalleDTO.ParticipanteEventoDTO p = new EventoDetalleDTO.ParticipanteEventoDTO();
            p.setNombre(ep.getUsuario() != null ? ep.getUsuario().getNombre() : "");
            p.setRol(ep.getRol());
            p.setAporte(ep.getAporte());
            return p;
        }).toList());

        // Contratación de asador
        List<com.basados.api.entity.ContratacionAsador> contrataciones =
            contratacionRepository.findByIdEvento(evento.getIdEvento());
        if (!contrataciones.isEmpty()) {
            com.basados.api.entity.ContratacionAsador c = contrataciones.get(0);
            EventoDetalleDTO.ContratacionDTO contDto = new EventoDetalleDTO.ContratacionDTO();
            contDto.setIdContratacion(c.getIdContratacion());
            contDto.setValorAcordado(c.getValorAcordado());
            contDto.setEstado(c.getEstado());
            if (c.getMaestro() != null && c.getMaestro().getUsuario() != null) {
                contDto.setNombreMaestro(
                    c.getMaestro().getUsuario().getNombre() + " " +
                    c.getMaestro().getUsuario().getApellido()
                );
            }
            dto.setContratacion(contDto);
        }

        return dto;
    }

    @GetMapping("/usuario/{idUsuario}")
    public List<EventoResponseDTO> listarPorUsuario(@PathVariable String idUsuario) {
        UUID uuid = UUID.fromString(idUsuario);
        return eventoRepository
            .findByOrganizador_IdUsuarioOrderByFechaCreacionDesc(uuid)
            .stream()
            .filter(e -> !"BORRADOR".equals(e.getEstado()))
            .map(evento -> new EventoResponseDTO(
                evento.getIdEvento(),
                evento.getNombre(),
                evento.getDescripcion(),
                evento.getFechaEvento(),
                evento.getDireccion(),
                evento.getPresupuesto(),
                evento.getCantidadPersonas(),
                evento.getEstado(),
                evento.getOrganizador() != null ? evento.getOrganizador().getNombre() : null
            ))
            .toList();
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable String id) {
        UUID uuid = UUID.fromString(id);
        Evento evento = eventoRepository.findById(uuid).orElseThrow();
        evento.setActivo(false);
        eventoRepository.save(evento);
    }
    public EventoResponseDTO obtenerBorrador(@PathVariable String idUsuario) {
        UUID uuid = UUID.fromString(idUsuario);
        return eventoRepository
            .findByOrganizador_IdUsuarioAndEstado(uuid, "BORRADOR")
            .stream()
            .findFirst()
            .map(evento -> new EventoResponseDTO(
                evento.getIdEvento(),
                evento.getNombre(),
                evento.getDescripcion(),
                evento.getFechaEvento(),
                evento.getDireccion(),
                evento.getPresupuesto(),
                evento.getCantidadPersonas(),
                evento.getEstado(),
                evento.getOrganizador() != null ? evento.getOrganizador().getNombre() : null
            ))
            .orElse(null);
    }

    @PostMapping
    public Evento crear(@RequestBody EventoRequestDTO dto) {
        UUID organizadorId = UUID.fromString(dto.getIdOrganizador());
        Usuario organizador = usuarioRepository.findById(organizadorId).orElseThrow();

        Evento evento = new Evento();
        evento.setIdEvento(UUID.randomUUID());
        evento.setNombre(dto.getNombre());
        evento.setDescripcion(dto.getDescripcion());
        evento.setFechaEvento(dto.getFechaEvento());
        evento.setDireccion(dto.getDireccion());
        evento.setPresupuesto(dto.getPresupuesto());
        evento.setCantidadPersonas(dto.getCantidadPersonas());
        evento.setEstado(dto.getEstado() != null ? dto.getEstado() : "BORRADOR");
        evento.setActivo(true);
        evento.setFechaCreacion(LocalDateTime.now());
        evento.setOrganizador(organizador);
        evento.setUsuario(organizador);

        return eventoRepository.save(evento);
    }

    @PutMapping("/{id}")
    public Evento actualizar(@PathVariable String id, @RequestBody EventoRequestDTO dto) {
        UUID uuid = UUID.fromString(id);
        Evento evento = eventoRepository.findById(uuid).orElseThrow();

        if (dto.getNombre() != null) evento.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) evento.setDescripcion(dto.getDescripcion());
        if (dto.getFechaEvento() != null) evento.setFechaEvento(dto.getFechaEvento());
        if (dto.getDireccion() != null) evento.setDireccion(dto.getDireccion());
        if (dto.getPresupuesto() != null) evento.setPresupuesto(dto.getPresupuesto());
        if (dto.getCantidadPersonas() != null) evento.setCantidadPersonas(dto.getCantidadPersonas());
        if (dto.getEstado() != null) evento.setEstado(dto.getEstado());

        return eventoRepository.save(evento);
    }
}