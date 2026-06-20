package com.basados.api.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public class CotizacionRequestDTO {

    @NotEmpty(message = "Debe incluir al menos un producto para cotizar")
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