package com.basados.api.dto;

import java.math.BigDecimal;

public class ProductoResponseDTO {

    private Long id;
    private String nombre;
    private String categoria;
    private String comercio;
    private String marca;
    private BigDecimal calorias;
    private BigDecimal precioReferencia;
    private Boolean alcoholico;

    public ProductoResponseDTO() {
    }

    public ProductoResponseDTO(
            Long id,
            String nombre,
            String categoria,
            String comercio,
            String marca,
            BigDecimal calorias,
            BigDecimal precioReferencia,
            Boolean alcoholico
    ) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.comercio = comercio;
        this.marca = marca;
        this.calorias = calorias;
        this.precioReferencia = precioReferencia;
        this.alcoholico = alcoholico;
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public String getComercio() {
        return comercio;
    }

    public String getMarca() {
        return marca;
    }

    public BigDecimal getCalorias() {
        return calorias;
    }

    public BigDecimal getPrecioReferencia() {
        return precioReferencia;
    }

    public Boolean getAlcoholico() {
        return alcoholico;
    }
}