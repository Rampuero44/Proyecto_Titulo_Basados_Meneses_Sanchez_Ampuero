package com.basados.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class EventoParticipanteResponseDTO {

    private UUID id;
    private UUID idEvento;
    private UUID idUsuario;
    private String nombreUsuario;
    private String rol;
    private BigDecimal aporte;
    private Boolean asistencia;
    private LocalDateTime fechaUnion;

    public EventoParticipanteResponseDTO() {
    }

    public EventoParticipanteResponseDTO(
            UUID id,
            UUID idEvento,
            UUID idUsuario,
            String nombreUsuario,
            String rol,
            BigDecimal aporte,
            Boolean asistencia,
            LocalDateTime fechaUnion
    ) {
        this.id = id;
        this.idEvento = idEvento;
        this.idUsuario = idUsuario;
        this.nombreUsuario = nombreUsuario;
        this.rol = rol;
        this.aporte = aporte;
        this.asistencia = asistencia;
        this.fechaUnion = fechaUnion;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getIdEvento() { return idEvento; }
    public void setIdEvento(UUID idEvento) { this.idEvento = idEvento; }

    public UUID getIdUsuario() { return idUsuario; }
    public void setIdUsuario(UUID idUsuario) { this.idUsuario = idUsuario; }

    public String getNombreUsuario() { return nombreUsuario; }
    public void setNombreUsuario(String nombreUsuario) { this.nombreUsuario = nombreUsuario; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public BigDecimal getAporte() { return aporte; }
    public void setAporte(BigDecimal aporte) { this.aporte = aporte; }

    public Boolean getAsistencia() { return asistencia; }
    public void setAsistencia(Boolean asistencia) { this.asistencia = asistencia; }

    public LocalDateTime getFechaUnion() { return fechaUnion; }
    public void setFechaUnion(LocalDateTime fechaUnion) { this.fechaUnion = fechaUnion; }
}
