package com.basados.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class EventoParticipanteRequestDTO {

    @NotBlank(message = "El idEvento es obligatorio")
    private String idEvento;

    @NotBlank(message = "El idUsuario es obligatorio")
    private String idUsuario;
    private String rol;

    @PositiveOrZero(message = "El aporte no puede ser negativo")
    private BigDecimal aporte;
    private Boolean asistencia;

    public EventoParticipanteRequestDTO() {}

    public String getIdEvento() { return idEvento; }
    public void setIdEvento(String idEvento) { this.idEvento = idEvento; }

    public String getIdUsuario() { return idUsuario; }
    public void setIdUsuario(String idUsuario) { this.idUsuario = idUsuario; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public BigDecimal getAporte() { return aporte; }
    public void setAporte(BigDecimal aporte) { this.aporte = aporte; }

    public Boolean getAsistencia() { return asistencia; }
    public void setAsistencia(Boolean asistencia) { this.asistencia = asistencia; }
}