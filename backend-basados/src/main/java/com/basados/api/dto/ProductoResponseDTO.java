package com.basados.api.dto;

import java.math.BigDecimal;

public class ProductoResponseDTO {

    private Long id;
    private String nombre;
    private String categoria;
    private String marca;
    private BigDecimal calorias;
    private Boolean alcoholico;

    public ProductoResponseDTO() {
    }

    public ProductoResponseDTO(
            Long id,
            String nombre,
            String categoria,
            String marca,
            BigDecimal calorias,
            Boolean alcoholico
    ) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.marca = marca;
        this.calorias = calorias;
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

    public String getMarca() {
        return marca;
    }

    public BigDecimal getCalorias() {
        return calorias;
    }

    public Boolean getAlcoholico() {
        return alcoholico;
    }
}