package com.basados.api.dto;

import java.math.BigDecimal;

public class ContratacionRequest {

    private Long idMaestro;
    private BigDecimal valorAcordado;
    private String idEvento;

    public ContratacionRequest() {}

    public Long getIdMaestro() { return idMaestro; }
    public void setIdMaestro(Long idMaestro) { this.idMaestro = idMaestro; }

    public BigDecimal getValorAcordado() { return valorAcordado; }
    public void setValorAcordado(BigDecimal valorAcordado) { this.valorAcordado = valorAcordado; }

    public String getIdEvento() { return idEvento; }
    public void setIdEvento(String idEvento) { this.idEvento = idEvento; }
}