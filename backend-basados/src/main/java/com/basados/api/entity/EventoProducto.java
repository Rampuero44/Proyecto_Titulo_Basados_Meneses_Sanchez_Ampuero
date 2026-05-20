package com.basados.api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "evento_productos")
public class EventoProducto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento_producto")
    private Long idEventoProducto;

    @ManyToOne
    @JoinColumn(name = "id_evento", nullable = false)
    private Evento evento;

    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "id_historial")
    private HistorialPrecio historialPrecio;

    @Column(name = "cantidad", nullable = false)
    private BigDecimal cantidad;

    @Column(name = "seleccionado")
    private Boolean seleccionado;

    public EventoProducto() {
    }

    public Long getIdEventoProducto() {
        return idEventoProducto;
    }

    public void setIdEventoProducto(Long idEventoProducto) {
        this.idEventoProducto = idEventoProducto;
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

    public HistorialPrecio getHistorialPrecio() {
        return historialPrecio;
    }

    public void setHistorialPrecio(HistorialPrecio historialPrecio) {
        this.historialPrecio = historialPrecio;
    }

    public BigDecimal getCantidad() {
        return cantidad;
    }

    public void setCantidad(BigDecimal cantidad) {
        this.cantidad = cantidad;
    }

    public Boolean getSeleccionado() {
        return seleccionado;
    }

    public void setSeleccionado(Boolean seleccionado) {
        this.seleccionado = seleccionado;
    }
}