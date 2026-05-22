package com.basados.api.dto;

public class IaResponseDTO {
    private String texto;
    private boolean ok;

    public IaResponseDTO(String texto, boolean ok) {
        this.texto = texto;
        this.ok = ok;
    }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public boolean isOk() { return ok; }
    public void setOk(boolean ok) { this.ok = ok; }
}