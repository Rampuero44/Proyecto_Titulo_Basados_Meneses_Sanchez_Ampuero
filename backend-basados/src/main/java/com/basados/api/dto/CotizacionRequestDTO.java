package com.basados.api.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public class CotizacionRequestDTO {

    @NotEmpty(message = "Debe incluir al menos un producto para cotizar")
    @Size(max = 50, message = "No puede cotizar más de 50 productos a la vez")
    private List<CotizacionProductoDTO> productos;

    public CotizacionRequestDTO() {}

    public List<CotizacionProductoDTO> getProductos() { return productos; }
    public void setProductos(List<CotizacionProductoDTO> productos) { this.productos = productos; }
}