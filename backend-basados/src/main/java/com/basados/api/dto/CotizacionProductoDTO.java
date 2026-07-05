package com.basados.api.dto;

public class CotizacionProductoDTO {

    private Long idProducto;

    private Integer cantidad;

    public CotizacionProductoDTO() {
    }

    public Long getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(Long idProducto) {
        this.idProducto = idProducto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }
}