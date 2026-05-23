package com.basados.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "gastos_evento")
public class GastoEvento {

    @Id
    @Column(name = "id_gasto", updatable = false, nullable = false)
    private UUID idGasto;

    @ManyToOne
    @JoinColumn(name = "id_evento")
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private Producto producto;

    @Column(name = "monto")
    private BigDecimal monto;

    @Column(name = "cantidad")
    private Integer cantidad;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    public GastoEvento() {
    }

    public UUID getIdGasto() {
        return idGasto;
    }

    public void setIdGasto(UUID idGasto) {
        this.idGasto = idGasto;
    }

    public Evento getEvento() {
        return evento;
    }

    public void setEvento(Evento evento) {
        this.evento = evento;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public Integer getCantidad() {
        return cantidad;
    }

    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}