package com.basados.api.dto;

import java.math.BigDecimal;

public class ProductoResponseDTO {

    private Long id;
    private String nombre;
    private String categoria;
    private String slugCategoria;
    private String marca;
    private BigDecimal calorias;
    private Boolean alcoholico;
    private String imagenUrl;
    private BigDecimal precioDesde;
    private String precioUnitario;
    private BigDecimal pesoGramos;
    private String unidadFormato;

    public ProductoResponseDTO() {}

    public ProductoResponseDTO(
            Long id,
            String nombre,
            String categoria,
            String slugCategoria,
            String marca,
            BigDecimal calorias,
            Boolean alcoholico,
            String imagenUrl,
            BigDecimal precioDesde,
            String precioUnitario,
            BigDecimal pesoGramos,
            String unidadFormato
    ) {
        this.id = id;
        this.nombre = nombre;
        this.categoria = categoria;
        this.slugCategoria = slugCategoria;
        this.marca = marca;
        this.calorias = calorias;
        this.alcoholico = alcoholico;
        this.imagenUrl = imagenUrl;
        this.precioDesde = precioDesde;
        this.precioUnitario = precioUnitario;
        this.pesoGramos = pesoGramos;
        this.unidadFormato = unidadFormato;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getSlugCategoria() { return slugCategoria; }
    public void setSlugCategoria(String slugCategoria) { this.slugCategoria = slugCategoria; }

    public String getMarca() { return marca; }
    public void setMarca(String marca) { this.marca = marca; }

    public BigDecimal getCalorias() { return calorias; }
    public void setCalorias(BigDecimal calorias) { this.calorias = calorias; }

    public Boolean getAlcoholico() { return alcoholico; }
    public void setAlcoholico(Boolean alcoholico) { this.alcoholico = alcoholico; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public BigDecimal getPrecioDesde() { return precioDesde; }
    public void setPrecioDesde(BigDecimal precioDesde) { this.precioDesde = precioDesde; }

    public String getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(String precioUnitario) { this.precioUnitario = precioUnitario; }

    public BigDecimal getPesoGramos() { return pesoGramos; }
    public void setPesoGramos(BigDecimal pesoGramos) { this.pesoGramos = pesoGramos; }

    public String getUnidadFormato() { return unidadFormato; }
    public void setUnidadFormato(String unidadFormato) { this.unidadFormato = unidadFormato; }
}