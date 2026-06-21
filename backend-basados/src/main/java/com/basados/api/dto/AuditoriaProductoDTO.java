package com.basados.api.dto;

import java.time.LocalDateTime;

public class AuditoriaProductoDTO {

    private Long idAuditoria;
    private String nombreProducto;
    private String accion;
    private LocalDateTime fechaCambio;
    private String usuarioResponsable;

    public AuditoriaProductoDTO() {
    }

    public AuditoriaProductoDTO(Long idAuditoria, String nombreProducto, String accion,
                                 LocalDateTime fechaCambio, String usuarioResponsable) {
        this.idAuditoria = idAuditoria;
        this.nombreProducto = nombreProducto;
        this.accion = accion;
        this.fechaCambio = fechaCambio;
        this.usuarioResponsable = usuarioResponsable;
    }

    public Long getIdAuditoria() {
        return idAuditoria;
    }

    public void setIdAuditoria(Long idAuditoria) {
        this.idAuditoria = idAuditoria;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getAccion() {
        return accion;
    }

    public void setAccion(String accion) {
        this.accion = accion;
    }

    public LocalDateTime getFechaCambio() {
        return fechaCambio;
    }

    public void setFechaCambio(LocalDateTime fechaCambio) {
        this.fechaCambio = fechaCambio;
    }

    public String getUsuarioResponsable() {
        return usuarioResponsable;
    }

    public void setUsuarioResponsable(String usuarioResponsable) {
        this.usuarioResponsable = usuarioResponsable;
    }
}
