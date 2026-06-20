package com.basados.api.dto;

import jakarta.validation.constraints.PositiveOrZero;

import java.util.List;

public class SugerenciasRequest {
    @PositiveOrZero(message = "La cantidad de asistentes no puede ser negativa")
    private int asistentes;
    private String tipoAsado;

    @PositiveOrZero(message = "El presupuesto no puede ser negativo")
    private int presupuesto;
    private List<ProductoIaDTO> productos;

    public SugerenciasRequest() {}

    public int getAsistentes() { return asistentes; }
    public void setAsistentes(int asistentes) { this.asistentes = asistentes; }

    public String getTipoAsado() { return tipoAsado; }
    public void setTipoAsado(String tipoAsado) { this.tipoAsado = tipoAsado; }

    public int getPresupuesto() { return presupuesto; }
    public void setPresupuesto(int presupuesto) { this.presupuesto = presupuesto; }

    public List<ProductoIaDTO> getProductos() { return productos; }
    public void setProductos(List<ProductoIaDTO> productos) { this.productos = productos; }
}