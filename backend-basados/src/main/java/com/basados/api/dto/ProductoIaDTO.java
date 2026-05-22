package com.basados.api.dto;

public class ProductoIaDTO {
    private String nombre;
    private int cantidad;
    private String slugCategoria;
    private String precioUnitario;

    public ProductoIaDTO() {}

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }

    public String getSlugCategoria() { return slugCategoria; }
    public void setSlugCategoria(String slugCategoria) { this.slugCategoria = slugCategoria; }

    public String getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(String precioUnitario) { this.precioUnitario = precioUnitario; }
}