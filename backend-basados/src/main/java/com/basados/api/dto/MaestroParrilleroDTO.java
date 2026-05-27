package com.basados.api.dto;

import java.math.BigDecimal;

public class MaestroParrilleroDTO {

    private Long idMaestro;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private String descripcion;
    private Integer experienciaAnos;
    private BigDecimal valorServicio;
    private Boolean disponibilidad;
    private BigDecimal puntuacion;

    public MaestroParrilleroDTO() {}

    public MaestroParrilleroDTO(Long idMaestro, String nombre, String apellido,
            String correo, String telefono, String descripcion,
            Integer experienciaAnos, BigDecimal valorServicio,
            Boolean disponibilidad, BigDecimal puntuacion) {
        this.idMaestro = idMaestro;
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
        this.telefono = telefono;
        this.descripcion = descripcion;
        this.experienciaAnos = experienciaAnos;
        this.valorServicio = valorServicio;
        this.disponibilidad = disponibilidad;
        this.puntuacion = puntuacion;
    }

    public Long getIdMaestro() { return idMaestro; }
    public void setIdMaestro(Long idMaestro) { this.idMaestro = idMaestro; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getExperienciaAnos() { return experienciaAnos; }
    public void setExperienciaAnos(Integer experienciaAnos) { this.experienciaAnos = experienciaAnos; }

    public BigDecimal getValorServicio() { return valorServicio; }
    public void setValorServicio(BigDecimal valorServicio) { this.valorServicio = valorServicio; }

    public Boolean getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(Boolean disponibilidad) { this.disponibilidad = disponibilidad; }

    public BigDecimal getPuntuacion() { return puntuacion; }
    public void setPuntuacion(BigDecimal puntuacion) { this.puntuacion = puntuacion; }
}