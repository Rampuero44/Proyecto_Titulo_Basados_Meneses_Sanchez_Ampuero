package com.basados.api.dto;

import java.math.BigDecimal;
import java.util.List;

public class CotizacionResultadoDTO {

    private String comercio;

    private BigDecimal total;

    private Integer productosEncontrados;

    private Integer productosFaltantes;

    private List<CotizacionItemDTO> items;

    public CotizacionResultadoDTO() {
    }

    public String getComercio() {
        return comercio;
    }

    public void setComercio(String comercio) {
        this.comercio = comercio;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public Integer getProductosEncontrados() {
        return productosEncontrados;
    }

    public void setProductosEncontrados(Integer productosEncontrados) {
        this.productosEncontrados = productosEncontrados;
    }

    public Integer getProductosFaltantes() {
        return productosFaltantes;
    }

    public void setProductosFaltantes(Integer productosFaltantes) {
        this.productosFaltantes = productosFaltantes;
    }

    public List<CotizacionItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CotizacionItemDTO> items) {
        this.items = items;
    }
}