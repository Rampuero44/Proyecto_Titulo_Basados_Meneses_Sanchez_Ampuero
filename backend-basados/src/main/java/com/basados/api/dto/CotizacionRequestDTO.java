package com.basados.api.dto;

import java.util.List;

public class CotizacionRequestDTO {

    private List<CotizacionProductoDTO> productos;

    public CotizacionRequestDTO() {
    }

    public List<CotizacionProductoDTO> getProductos() {
        return productos;
    }

    public void setProductos(List<CotizacionProductoDTO> productos) {
        this.productos = productos;
    }
}