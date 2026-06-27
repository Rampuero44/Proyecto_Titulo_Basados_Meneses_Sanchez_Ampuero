package com.basados.api.dto;

import java.util.List;

public class AdminMetricasDTO {

    private long totalUsuarios;
    private long usuariosActivos;
    private long usuariosInactivos;
    private List<EventosPorEstadoDTO> eventosPorEstado;
    private List<ProductoMasSeleccionadoDTO> productosMasSeleccionados;
    private List<UsuariosPorRolDTO> usuariosPorRol;
    private List<RegistrosPorMesDTO> registrosPorMes;

    public AdminMetricasDTO() {}

    public AdminMetricasDTO(long totalUsuarios, long usuariosActivos, long usuariosInactivos,
                             List<EventosPorEstadoDTO> eventosPorEstado,
                             List<ProductoMasSeleccionadoDTO> productosMasSeleccionados,
                             List<UsuariosPorRolDTO> usuariosPorRol,
                             List<RegistrosPorMesDTO> registrosPorMes) {
        this.totalUsuarios = totalUsuarios;
        this.usuariosActivos = usuariosActivos;
        this.usuariosInactivos = usuariosInactivos;
        this.eventosPorEstado = eventosPorEstado;
        this.productosMasSeleccionados = productosMasSeleccionados;
        this.usuariosPorRol = usuariosPorRol;
        this.registrosPorMes = registrosPorMes;
    }

    public long getTotalUsuarios() { return totalUsuarios; }
    public void setTotalUsuarios(long totalUsuarios) { this.totalUsuarios = totalUsuarios; }

    public long getUsuariosActivos() { return usuariosActivos; }
    public void setUsuariosActivos(long usuariosActivos) { this.usuariosActivos = usuariosActivos; }

    public long getUsuariosInactivos() { return usuariosInactivos; }
    public void setUsuariosInactivos(long usuariosInactivos) { this.usuariosInactivos = usuariosInactivos; }

    public List<EventosPorEstadoDTO> getEventosPorEstado() { return eventosPorEstado; }
    public void setEventosPorEstado(List<EventosPorEstadoDTO> eventosPorEstado) { this.eventosPorEstado = eventosPorEstado; }

    public List<ProductoMasSeleccionadoDTO> getProductosMasSeleccionados() { return productosMasSeleccionados; }
    public void setProductosMasSeleccionados(List<ProductoMasSeleccionadoDTO> productosMasSeleccionados) { this.productosMasSeleccionados = productosMasSeleccionados; }

    public List<UsuariosPorRolDTO> getUsuariosPorRol() { return usuariosPorRol; }
    public void setUsuariosPorRol(List<UsuariosPorRolDTO> usuariosPorRol) { this.usuariosPorRol = usuariosPorRol; }

    public List<RegistrosPorMesDTO> getRegistrosPorMes() { return registrosPorMes; }
    public void setRegistrosPorMes(List<RegistrosPorMesDTO> registrosPorMes) { this.registrosPorMes = registrosPorMes; }

    public static class EventosPorEstadoDTO {
        private String estado;
        private long cantidad;
        public EventosPorEstadoDTO() {}
        public EventosPorEstadoDTO(String estado, long cantidad) { this.estado = estado; this.cantidad = cantidad; }
        public String getEstado() { return estado; }
        public void setEstado(String estado) { this.estado = estado; }
        public long getCantidad() { return cantidad; }
        public void setCantidad(long cantidad) { this.cantidad = cantidad; }
    }

    public static class ProductoMasSeleccionadoDTO {
        private String nombre;
        private long vecesSeleccionado;
        public ProductoMasSeleccionadoDTO() {}
        public ProductoMasSeleccionadoDTO(String nombre, long vecesSeleccionado) { this.nombre = nombre; this.vecesSeleccionado = vecesSeleccionado; }
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public long getVecesSeleccionado() { return vecesSeleccionado; }
        public void setVecesSeleccionado(long vecesSeleccionado) { this.vecesSeleccionado = vecesSeleccionado; }
    }

    public static class UsuariosPorRolDTO {
        private String rol;
        private long cantidad;
        public UsuariosPorRolDTO() {}
        public UsuariosPorRolDTO(String rol, long cantidad) { this.rol = rol; this.cantidad = cantidad; }
        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
        public long getCantidad() { return cantidad; }
        public void setCantidad(long cantidad) { this.cantidad = cantidad; }
    }

    public static class RegistrosPorMesDTO {
        private String mes;
        private long cantidad;
        public RegistrosPorMesDTO() {}
        public RegistrosPorMesDTO(String mes, long cantidad) { this.mes = mes; this.cantidad = cantidad; }
        public String getMes() { return mes; }
        public void setMes(String mes) { this.mes = mes; }
        public long getCantidad() { return cantidad; }
        public void setCantidad(long cantidad) { this.cantidad = cantidad; }
    }
}