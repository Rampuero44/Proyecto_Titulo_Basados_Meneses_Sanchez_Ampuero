package com.basados.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class EventoCompletoRequestDTO {

    @NotBlank(message = "El nombre del evento es obligatorio")
    private String nombre;
    private String descripcion;

    @NotNull(message = "La fecha del evento es obligatoria")
    private LocalDateTime fechaEvento;
    private String direccion;

    @PositiveOrZero(message = "El presupuesto no puede ser negativo")
    private BigDecimal presupuesto;

    @Positive(message = "La cantidad de personas debe ser mayor a cero")
    private Integer cantidadPersonas;
    private String estado;

    @NotBlank(message = "El idOrganizador es obligatorio")
    private String idOrganizador;

    @NotEmpty(message = "Debe incluir al menos un producto")
    @Valid
    private List<EventoCompletoProductoDTO> productos;

    public EventoCompletoRequestDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public LocalDateTime getFechaEvento() { return fechaEvento; }
    public void setFechaEvento(LocalDateTime fechaEvento) { this.fechaEvento = fechaEvento; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public BigDecimal getPresupuesto() { return presupuesto; }
    public void setPresupuesto(BigDecimal presupuesto) { this.presupuesto = presupuesto; }

    public Integer getCantidadPersonas() { return cantidadPersonas; }
    public void setCantidadPersonas(Integer cantidadPersonas) { this.cantidadPersonas = cantidadPersonas; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getIdOrganizador() { return idOrganizador; }
    public void setIdOrganizador(String idOrganizador) { this.idOrganizador = idOrganizador; }

    public List<EventoCompletoProductoDTO> getProductos() { return productos; }
    public void setProductos(List<EventoCompletoProductoDTO> productos) { this.productos = productos; }
}
