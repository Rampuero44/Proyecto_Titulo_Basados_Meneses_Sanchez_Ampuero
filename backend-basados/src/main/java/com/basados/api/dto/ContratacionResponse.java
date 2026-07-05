package com.basados.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ContratacionResponse {

    private Long idContratacion;
    private String nombreMaestro;
    private BigDecimal valorAcordado;
    private String estado;
    private LocalDateTime fechaContratacion;

    public ContratacionResponse() {}

    public ContratacionResponse(Long idContratacion, String nombreMaestro,
            BigDecimal valorAcordado, String estado, LocalDateTime fechaContratacion) {
        this.idContratacion = idContratacion;
        this.nombreMaestro = nombreMaestro;
        this.valorAcordado = valorAcordado;
        this.estado = estado;
        this.fechaContratacion = fechaContratacion;
    }

    public Long getIdContratacion() { return idContratacion; }
    public void setIdContratacion(Long idContratacion) { this.idContratacion = idContratacion; }

    public String getNombreMaestro() { return nombreMaestro; }
    public void setNombreMaestro(String nombreMaestro) { this.nombreMaestro = nombreMaestro; }

    public BigDecimal getValorAcordado() { return valorAcordado; }
    public void setValorAcordado(BigDecimal valorAcordado) { this.valorAcordado = valorAcordado; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaContratacion() { return fechaContratacion; }
    public void setFechaContratacion(LocalDateTime fechaContratacion) { this.fechaContratacion = fechaContratacion; }
}