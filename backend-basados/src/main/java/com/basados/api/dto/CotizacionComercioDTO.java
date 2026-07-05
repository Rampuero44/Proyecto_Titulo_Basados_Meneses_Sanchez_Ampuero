package com.basados.api.dto;

public class CotizacionComercioDTO {
    private String comercio;
    private double total;

    public CotizacionComercioDTO() {}

    public String getComercio() { return comercio; }
    public void setComercio(String comercio) { this.comercio = comercio; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }
}