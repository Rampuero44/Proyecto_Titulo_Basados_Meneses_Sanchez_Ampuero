package com.basados.api.service;

import com.basados.api.dto.EventoCompletoProductoDTO;
import com.basados.api.dto.EventoCompletoRequestDTO;
import com.basados.api.dto.EventoDetalleDTO;
import com.basados.api.dto.EventoRequestDTO;
import com.basados.api.dto.EventoResponseDTO;
import com.basados.api.entity.ContratacionAsador;
import com.basados.api.entity.Evento;
import com.basados.api.entity.EventoParticipante;
import com.basados.api.entity.EventoProducto;
import com.basados.api.entity.HistorialPrecio;
import com.basados.api.entity.Producto;
import com.basados.api.entity.Usuario;
import com.basados.api.repository.ContratacionRepository;
import com.basados.api.repository.EventoParticipanteRepository;
import com.basados.api.repository.EventoProductoRepository;
import com.basados.api.repository.EventoRepository;
import com.basados.api.repository.HistorialPrecioRepository;
import com.basados.api.repository.ProductoRepository;
import com.basados.api.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EventoParticipanteRepository participanteRepository;
    private final EventoProductoRepository productoEventoRepository;
    private final ContratacionRepository contratacionRepository;
    private final ProductoRepository productoRepository;
    private final HistorialPrecioRepository historialPrecioRepository;

    public EventoService(
            EventoRepository eventoRepository,
            UsuarioRepository usuarioRepository,
            EventoParticipanteRepository participanteRepository,
            EventoProductoRepository productoEventoRepository,
            ContratacionRepository contratacionRepository,
            ProductoRepository productoRepository,
            HistorialPrecioRepository historialPrecioRepository
    ) {
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
        this.participanteRepository = participanteRepository;
        this.productoEventoRepository = productoEventoRepository;
        this.contratacionRepository = contratacionRepository;
        this.productoRepository = productoRepository;
        this.historialPrecioRepository = historialPrecioRepository;
    }

    private UUID obtenerUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No autenticado");
        }
        return UUID.fromString(auth.getPrincipal().toString());
    }

    private void verificarPropiedadEvento(Evento evento, UUID usuarioId) {
        if (evento.getOrganizador() == null ||
                !evento.getOrganizador().getIdUsuario().equals(usuarioId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "No tienes permiso para modificar este evento");
        }
    }

    @Transactional(readOnly = true)
    public List<EventoResponseDTO> listarEventos() {
        return eventoRepository.findAll().stream()
            .map(this::toResponseDTO)
            .toList();
    }

    @Transactional(readOnly = true)
    public EventoDetalleDTO obtenerDetalle(String id) {
        UUID uuid = UUID.fromString(id);
        Evento evento = eventoRepository.findById(uuid).orElseThrow();

        if ("BORRADOR".equals(evento.getEstado())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no disponible");
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

        List<ContratacionAsador> contrataciones =
            contratacionRepository.findByIdEvento(evento.getIdEvento());
        if (!contrataciones.isEmpty()) {
            ContratacionAsador c = contrataciones.get(0);
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

    @Transactional(readOnly = true)
    public List<EventoResponseDTO> listarPorUsuario(String idUsuario) {
        UUID uuid = UUID.fromString(idUsuario);
        return eventoRepository
            .findByOrganizador_IdUsuarioOrderByFechaCreacionDesc(uuid)
            .stream()
            .filter(e -> !"BORRADOR".equals(e.getEstado()))
            .map(this::toResponseDTO)
            .toList();
    }

    @Transactional
    public void eliminar(String id) {
        UUID usuarioId = obtenerUsuarioAutenticado();
        UUID uuid = UUID.fromString(id);
        Evento evento = eventoRepository.findById(uuid).orElseThrow();
        verificarPropiedadEvento(evento, usuarioId);
        evento.setActivo(false);
        evento.setFechaEliminacion(LocalDateTime.now());
        eventoRepository.save(evento);
    }

    @Transactional(readOnly = true)
    public EventoResponseDTO obtenerBorrador(String idUsuario) {
        UUID uuid = UUID.fromString(idUsuario);
        return eventoRepository
            .findByOrganizador_IdUsuarioAndEstado(uuid, "BORRADOR")
            .stream()
            .findFirst()
            .map(this::toResponseDTO)
            .orElse(null);
    }

    @Transactional
    public EventoResponseDTO crear(EventoRequestDTO dto) {
        UUID organizadorId = obtenerUsuarioAutenticado();
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

        Evento guardado = eventoRepository.save(evento);
        return toResponseDTO(guardado);
    }

    @Transactional
    public EventoResponseDTO crearCompleto(EventoCompletoRequestDTO dto) {
        UUID organizadorId = obtenerUsuarioAutenticado();
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

        Evento eventoGuardado = eventoRepository.save(evento);

        for (EventoCompletoProductoDTO productoDto : dto.getProductos()) {
            Producto producto = productoRepository.findById(productoDto.getIdProducto())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Producto no encontrado: " + productoDto.getIdProducto()));

            HistorialPrecio historial = null;
            if (productoDto.getIdHistorial() != null) {
                historial = historialPrecioRepository.findById(productoDto.getIdHistorial()).orElse(null);
            }

            EventoProducto ep = new EventoProducto();
            ep.setIdEventoProducto(UUID.randomUUID());
            ep.setEvento(eventoGuardado);
            ep.setProducto(producto);
            ep.setCantidad(productoDto.getCantidad());
            ep.setHistorialPrecio(historial);
            ep.setSeleccionado(productoDto.getSeleccionado());

            productoEventoRepository.save(ep);
        }

        return toResponseDTO(eventoGuardado);
    }

    @Transactional
    public EventoResponseDTO actualizar(String id, EventoRequestDTO dto) {
        UUID usuarioId = obtenerUsuarioAutenticado();
        UUID uuid = UUID.fromString(id);
        Evento evento = eventoRepository.findById(uuid).orElseThrow();
        verificarPropiedadEvento(evento, usuarioId);

        if (dto.getNombre() != null) evento.setNombre(dto.getNombre());
        if (dto.getDescripcion() != null) evento.setDescripcion(dto.getDescripcion());
        if (dto.getFechaEvento() != null) evento.setFechaEvento(dto.getFechaEvento());
        if (dto.getDireccion() != null) evento.setDireccion(dto.getDireccion());
        if (dto.getPresupuesto() != null) evento.setPresupuesto(dto.getPresupuesto());
        if (dto.getCantidadPersonas() != null) evento.setCantidadPersonas(dto.getCantidadPersonas());
        if (dto.getEstado() != null) evento.setEstado(dto.getEstado());

        Evento guardado = eventoRepository.save(evento);
        return toResponseDTO(guardado);
    }

    private EventoResponseDTO toResponseDTO(Evento evento) {
        return new EventoResponseDTO(
            evento.getIdEvento(),
            evento.getNombre(),
            evento.getDescripcion(),
            evento.getFechaEvento(),
            evento.getDireccion(),
            evento.getPresupuesto(),
            evento.getCantidadPersonas(),
            evento.getEstado(),
            evento.getOrganizador() != null ? evento.getOrganizador().getNombre() : null
        );
    }
}