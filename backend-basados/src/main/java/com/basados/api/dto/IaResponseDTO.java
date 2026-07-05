package com.basados.api.dto;

public class IaResponseDTO {
    private String texto;
    private boolean ok;
    private int tokensConsumidos;

    public IaResponseDTO(String texto, boolean ok) {
        this(texto, ok, 0);
    }

    public IaResponseDTO(String texto, boolean ok, int tokensConsumidos) {
        this.texto = texto;
        this.ok = ok;
        this.tokensConsumidos = tokensConsumidos;
    }

    public String getTexto() { return texto; }
    public void setTexto(String texto) { this.texto = texto; }

    public boolean isOk() { return ok; }
    public void setOk(boolean ok) { this.ok = ok; }

    public int getTokensConsumidos() { return tokensConsumidos; }
    public void setTokensConsumidos(int tokensConsumidos) { this.tokensConsumidos = tokensConsumidos; }
}