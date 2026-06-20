package com.basados.api.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public class ResumenEventoRequest {
    @NotBlank(message = "El eventoId es obligatorio")
    private String eventoId;

    @NotBlank(message = "El nombreEvento es obligatorio")
    private String nombreEvento;
    private String fecha;
    private String organizador;
    private String organizadorEmail;
    private Integer participantes;
    private Integer costoTotal;
    private Integer costoPromedio;
    private Integer caloriasTotales;
    private Integer caloriasPorPersona;
    private String cotizacionSeleccionada;
    private String direccion;
    private List<DestinatarioDto> destinatarios;

    public String getEventoId() { return eventoId; }
    public void setEventoId(String eventoId) { this.eventoId = eventoId; }

    public String getNombreEvento() { return nombreEvento; }
    public void setNombreEvento(String nombreEvento) { this.nombreEvento = nombreEvento; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getOrganizador() { return organizador; }
    public void setOrganizador(String organizador) { this.organizador = organizador; }

    public String getOrganizadorEmail() { return organizadorEmail; }
    public void setOrganizadorEmail(String organizadorEmail) { this.organizadorEmail = organizadorEmail; }

    public Integer getParticipantes() { return participantes; }
    public void setParticipantes(Integer participantes) { this.participantes = participantes; }

    public Integer getCostoTotal() { return costoTotal; }
    public void setCostoTotal(Integer costoTotal) { this.costoTotal = costoTotal; }

    public Integer getCostoPromedio() { return costoPromedio; }
    public void setCostoPromedio(Integer costoPromedio) { this.costoPromedio = costoPromedio; }

    public Integer getCaloriasTotales() { return caloriasTotales; }
    public void setCaloriasTotales(Integer caloriasTotales) { this.caloriasTotales = caloriasTotales; }

    public Integer getCaloriasPorPersona() { return caloriasPorPersona; }
    public void setCaloriasPorPersona(Integer caloriasPorPersona) { this.caloriasPorPersona = caloriasPorPersona; }

    public String getCotizacionSeleccionada() { return cotizacionSeleccionada; }
    public void setCotizacionSeleccionada(String cotizacionSeleccionada) { this.cotizacionSeleccionada = cotizacionSeleccionada; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public List<DestinatarioDto> getDestinatarios() { return destinatarios; }
    public void setDestinatarios(List<DestinatarioDto> destinatarios) { this.destinatarios = destinatarios; }
}