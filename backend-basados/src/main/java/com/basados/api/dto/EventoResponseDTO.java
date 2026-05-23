package com.basados.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class EventoResponseDTO {

    private UUID id;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaEvento;
    private String direccion;
    private BigDecimal presupuesto;
    private Integer cantidadPersonas;
    private String estado;
    private String organizador;

    public EventoResponseDTO() {
    }

    public EventoResponseDTO(
            UUID id,
            String nombre,
            String descripcion,
            LocalDateTime fechaEvento,
            String direccion,
            BigDecimal presupuesto,
            Integer cantidadPersonas,
            String estado,
            String organizador
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaEvento = fechaEvento;
        this.direccion = direccion;
        this.presupuesto = presupuesto;
        this.cantidadPersonas = cantidadPersonas;
        this.estado = estado;
        this.organizador = organizador;
    }

    public UUID getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public LocalDateTime getFechaEvento() {
        return fechaEvento;
    }

    public String getDireccion() {
        return direccion;
    }

    public BigDecimal getPresupuesto() {
        return presupuesto;
    }

    public Integer getCantidadPersonas() {
        return cantidadPersonas;
    }

    public String getEstado() {
        return estado;
    }

    public String getOrganizador() {
        return organizador;
    }
}