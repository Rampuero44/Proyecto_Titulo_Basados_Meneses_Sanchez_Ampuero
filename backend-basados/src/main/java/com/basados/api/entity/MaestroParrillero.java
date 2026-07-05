package com.basados.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "maestros_parrilleros")
public class MaestroParrillero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_maestro")
    private Long idMaestro;

    @Column(name = "descripcion")
    private String descripcion;

    @Column(name = "experiencia_anos")
    private Integer experienciaAnos;

    @Column(name = "valor_servicio")
    private BigDecimal valorServicio;

    @Column(name = "latitud")
    private BigDecimal latitud;

    @Column(name = "longitud")
    private BigDecimal longitud;

    // disponibilidad = el asador gestiona si está activo para ser contratado
    @Column(name = "disponibilidad")
    private Boolean disponibilidad;

    @Column(name = "puntuacion")
    private BigDecimal puntuacion;

    // estado_solicitud = proceso administrativo: PENDIENTE | APROBADO | RECHAZADO
    @Column(name = "estado_solicitud")
    private String estadoSolicitud;

    @ManyToOne
    @JoinColumn(name = "id_usuario")
    private Usuario usuario;

    public MaestroParrillero() {}

    public Long getIdMaestro() { return idMaestro; }
    public void setIdMaestro(Long idMaestro) { this.idMaestro = idMaestro; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Integer getExperienciaAnos() { return experienciaAnos; }
    public void setExperienciaAnos(Integer experienciaAnos) { this.experienciaAnos = experienciaAnos; }

    public BigDecimal getValorServicio() { return valorServicio; }
    public void setValorServicio(BigDecimal valorServicio) { this.valorServicio = valorServicio; }

    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }

    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }

    public Boolean getDisponibilidad() { return disponibilidad; }
    public void setDisponibilidad(Boolean disponibilidad) { this.disponibilidad = disponibilidad; }

    public BigDecimal getPuntuacion() { return puntuacion; }
    public void setPuntuacion(BigDecimal puntuacion) { this.puntuacion = puntuacion; }

    public String getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(String estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
}