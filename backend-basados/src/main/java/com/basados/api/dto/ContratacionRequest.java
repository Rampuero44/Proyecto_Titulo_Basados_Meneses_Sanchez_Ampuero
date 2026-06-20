package com.basados.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class ContratacionRequest {

    @NotNull(message = "El idMaestro es obligatorio")
    private Long idMaestro;

    @Positive(message = "El valor acordado debe ser mayor a cero")
    private BigDecimal valorAcordado;

    @NotBlank(message = "El idEvento es obligatorio")
    private String idEvento;

    public ContratacionRequest() {}

    public Long getIdMaestro() { return idMaestro; }
    public void setIdMaestro(Long idMaestro) { this.idMaestro = idMaestro; }

    public BigDecimal getValorAcordado() { return valorAcordado; }
    public void setValorAcordado(BigDecimal valorAcordado) { this.valorAcordado = valorAcordado; }

    public String getIdEvento() { return idEvento; }
    public void setIdEvento(String idEvento) { this.idEvento = idEvento; }
}