package com.basados.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "contratacion_asador")
public class ContratacionAsador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_contratacion")
    private Long idContratacion;

    @ManyToOne
    @JoinColumn(name = "id_maestro", nullable = false)
    private MaestroParrillero maestro;

    @Column(name = "fecha_contratacion")
    private LocalDateTime fechaContratacion;

    @Column(name = "valor_acordado")
    private BigDecimal valorAcordado;

    @Column(name = "estado")
    private String estado;

    @Column(name = "id_evento")
    private UUID idEvento;

    public ContratacionAsador() {}

    public Long getIdContratacion() { return idContratacion; }
    public void setIdContratacion(Long idContratacion) { this.idContratacion = idContratacion; }

    public MaestroParrillero getMaestro() { return maestro; }
    public void setMaestro(MaestroParrillero maestro) { this.maestro = maestro; }

    public LocalDateTime getFechaContratacion() { return fechaContratacion; }
    public void setFechaContratacion(LocalDateTime fechaContratacion) { this.fechaContratacion = fechaContratacion; }

    public BigDecimal getValorAcordado() { return valorAcordado; }
    public void setValorAcordado(BigDecimal valorAcordado) { this.valorAcordado = valorAcordado; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public UUID getIdEvento() { return idEvento; }
    public void setIdEvento(UUID idEvento) { this.idEvento = idEvento; }
}