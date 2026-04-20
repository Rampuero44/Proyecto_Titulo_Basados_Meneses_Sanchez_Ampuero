package com.basados.api.dto;

public class NotificacionResponse {
    private int enviadosWhatsapp;
    private int enviadosEmail;

    public NotificacionResponse(int enviadosWhatsapp, int enviadosEmail) {
        this.enviadosWhatsapp = enviadosWhatsapp;
        this.enviadosEmail = enviadosEmail;
    }

    public int getEnviadosWhatsapp() {
        return enviadosWhatsapp;
    }

    public int getEnviadosEmail() {
        return enviadosEmail;
    }
}