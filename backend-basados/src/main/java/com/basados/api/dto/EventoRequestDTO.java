package com.basados.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class EventoRequestDTO {

    private String nombre;
    private String descripcion;
    private LocalDateTime fechaEvento;
    private String direccion;
    private BigDecimal presupuesto;
    private Integer cantidadPersonas;
    private String estado;
    private String idOrganizador;

    public EventoRequestDTO() {}

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
}