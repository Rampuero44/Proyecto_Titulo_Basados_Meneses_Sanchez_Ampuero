package com.basados.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class EventoProductoRequestDTO {

    @NotBlank(message = "El idEvento es obligatorio")
    private String idEvento;

    @NotNull(message = "El idProducto es obligatorio")
    private Long idProducto;
    private Long idHistorial;

    @Positive(message = "La cantidad debe ser mayor a cero")
    private BigDecimal cantidad;
    private Boolean seleccionado;

    public EventoProductoRequestDTO() {}

    public String getIdEvento() { return idEvento; }
    public void setIdEvento(String idEvento) { this.idEvento = idEvento; }

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public Long getIdHistorial() { return idHistorial; }
    public void setIdHistorial(Long idHistorial) { this.idHistorial = idHistorial; }

    public BigDecimal getCantidad() { return cantidad; }
    public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }

    public Boolean getSeleccionado() { return seleccionado; }
    public void setSeleccionado(Boolean seleccionado) { this.seleccionado = seleccionado; }
}