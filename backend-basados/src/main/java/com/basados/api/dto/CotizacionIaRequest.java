package com.basados.api.dto;

import java.util.List;

public class CotizacionIaRequest {
    private int asistentes;
    private String tipoAsado;
    private int presupuesto;
    private List<ProductoIaDTO> productos;
    private List<CotizacionComercioDTO> cotizaciones;

    public CotizacionIaRequest() {}

    public int getAsistentes() { return asistentes; }
    public void setAsistentes(int asistentes) { this.asistentes = asistentes; }

    public String getTipoAsado() { return tipoAsado; }
    public void setTipoAsado(String tipoAsado) { this.tipoAsado = tipoAsado; }

    public int getPresupuesto() { return presupuesto; }
    public void setPresupuesto(int presupuesto) { this.presupuesto = presupuesto; }

    public List<ProductoIaDTO> getProductos() { return productos; }
    public void setProductos(List<ProductoIaDTO> productos) { this.productos = productos; }

    public List<CotizacionComercioDTO> getCotizaciones() { return cotizaciones; }
    public void setCotizaciones(List<CotizacionComercioDTO> cotizaciones) { this.cotizaciones = cotizaciones; }
}