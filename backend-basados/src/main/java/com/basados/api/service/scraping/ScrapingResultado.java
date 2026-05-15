package com.basados.api.service.scraping;

import java.math.BigDecimal;

public class ScrapingResultado {

    private String nombreProducto;

    private BigDecimal precio;

    private boolean disponible;

    private String urlProducto;

    public ScrapingResultado() {
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(
            String nombreProducto
    ) {
        this.nombreProducto =
                nombreProducto;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(
            BigDecimal precio
    ) {
        this.precio = precio;
    }

    public boolean isDisponible() {
        return disponible;
    }

    public void setDisponible(
            boolean disponible
    ) {
        this.disponible =
                disponible;
    }

    public String getUrlProducto() {
        return urlProducto;
    }

    public void setUrlProducto(
            String urlProducto
    ) {
        this.urlProducto =
                urlProducto;
    }
}