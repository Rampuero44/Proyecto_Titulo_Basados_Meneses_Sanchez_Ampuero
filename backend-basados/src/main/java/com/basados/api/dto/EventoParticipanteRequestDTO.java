package com.basados.api.dto;

import java.math.BigDecimal;

public class EventoParticipanteRequestDTO {

    private String idEvento;
    private String idUsuario;
    private String rol;
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