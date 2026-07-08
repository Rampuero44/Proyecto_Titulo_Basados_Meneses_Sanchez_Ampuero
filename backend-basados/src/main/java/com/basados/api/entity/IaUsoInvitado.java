package com.basados.api.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "ia_uso_invitados")
public class IaUsoInvitado {

    @Id
    @Column(name = "ip", updatable = false, nullable = false, length = 45)
    private String ip;

    @Column(name = "fecha")
    private LocalDate fecha;

    @Column(name = "tokens_consumidos")
    private Integer tokensConsumidos;

    public IaUsoInvitado() {}

    public IaUsoInvitado(String ip, LocalDate fecha, Integer tokensConsumidos) {
        this.ip = ip;
        this.fecha = fecha;
        this.tokensConsumidos = tokensConsumidos;
    }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public Integer getTokensConsumidos() { return tokensConsumidos; }
    public void setTokensConsumidos(Integer tokensConsumidos) { this.tokensConsumidos = tokensConsumidos; }
}