package com.basados.api.dto;

import java.util.List;

public class AdminMetricasDTO {

    private long totalUsuarios;
    private List<EventosPorEstadoDTO> eventosPorEstado;
    private List<ProductoMasSeleccionadoDTO> productosMasSeleccionados;

    public AdminMetricasDTO() {
    }

    public AdminMetricasDTO(long totalUsuarios, List<EventosPorEstadoDTO> eventosPorEstado,
                             List<ProductoMasSeleccionadoDTO> productosMasSeleccionados) {
        this.totalUsuarios = totalUsuarios;
        this.eventosPorEstado = eventosPorEstado;
        this.productosMasSeleccionados = productosMasSeleccionados;
    }

    public long getTotalUsuarios() {
        return totalUsuarios;
    }

    public void setTotalUsuarios(long totalUsuarios) {
        this.totalUsuarios = totalUsuarios;
    }

    public List<EventosPorEstadoDTO> getEventosPorEstado() {
        return eventosPorEstado;
    }

    public void setEventosPorEstado(List<EventosPorEstadoDTO> eventosPorEstado) {
        this.eventosPorEstado = eventosPorEstado;
    }

    public List<ProductoMasSeleccionadoDTO> getProductosMasSeleccionados() {
        return productosMasSeleccionados;
    }

    public void setProductosMasSeleccionados(List<ProductoMasSeleccionadoDTO> productosMasSeleccionados) {
        this.productosMasSeleccionados = productosMasSeleccionados;
    }

    public static class EventosPorEstadoDTO {
        private String estado;
        private long cantidad;

        public EventosPorEstadoDTO() {
        }

        public EventosPorEstadoDTO(String estado, long cantidad) {
            this.estado = estado;
            this.cantidad = cantidad;
        }

        public String getEstado() {
            return estado;
        }

        public void setEstado(String estado) {
            this.estado = estado;
        }

        public long getCantidad() {
            return cantidad;
        }

        public void setCantidad(long cantidad) {
            this.cantidad = cantidad;
        }
    }

    public static class ProductoMasSeleccionadoDTO {
        private String nombre;
        private long vecesSeleccionado;

        public ProductoMasSeleccionadoDTO() {
        }

        public ProductoMasSeleccionadoDTO(String nombre, long vecesSeleccionado) {
            this.nombre = nombre;
            this.vecesSeleccionado = vecesSeleccionado;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public long getVecesSeleccionado() {
            return vecesSeleccionado;
        }

        public void setVecesSeleccionado(long vecesSeleccionado) {
            this.vecesSeleccionado = vecesSeleccionado;
        }
    }
}