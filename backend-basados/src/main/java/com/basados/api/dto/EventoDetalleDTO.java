package com.basados.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class EventoDetalleDTO {

    private UUID id;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaEvento;
    private String direccion;
    private BigDecimal presupuesto;
    private Integer cantidadPersonas;
    private String estado;
    private String organizador;
    private List<ProductoEventoDTO> productos;
    private List<ParticipanteEventoDTO> participantes;

    public static class ProductoEventoDTO {
        private Long idProducto;
        private String nombre;
        private String slugCategoria;
        private BigDecimal cantidad;
        private BigDecimal precioUnitario;
        private String precioUnitarioTexto;
        private String comercio;
        private Boolean seleccionado;

        public Long getIdProducto() { return idProducto; }
        public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getSlugCategoria() { return slugCategoria; }
        public void setSlugCategoria(String slugCategoria) { this.slugCategoria = slugCategoria; }
        public BigDecimal getCantidad() { return cantidad; }
        public void setCantidad(BigDecimal cantidad) { this.cantidad = cantidad; }
        public BigDecimal getPrecioUnitario() { return precioUnitario; }
        public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
        public String getPrecioUnitarioTexto() { return precioUnitarioTexto; }
        public void setPrecioUnitarioTexto(String precioUnitarioTexto) { this.precioUnitarioTexto = precioUnitarioTexto; }
        public String getComercio() { return comercio; }
        public void setComercio(String comercio) { this.comercio = comercio; }
        public Boolean getSeleccionado() { return seleccionado; }
        public void setSeleccionado(Boolean seleccionado) { this.seleccionado = seleccionado; }
    }

    public static class ParticipanteEventoDTO {
        private String nombre;
        private String rol;
        private BigDecimal aporte;

        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        public String getRol() { return rol; }
        public void setRol(String rol) { this.rol = rol; }
        public BigDecimal getAporte() { return aporte; }
        public void setAporte(BigDecimal aporte) { this.aporte = aporte; }
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDateTime getFechaEvento() { return fechaEvento; }
    public void setFechaEvento(LocalDateTime fechaEvento) { this.fechaEvento = fechaEvento; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public BigDecimal getPresupuesto() { return presupuesto; }
    public void setPresupuesto(BigDecimal presupuesto) { this.presupuesto = presupuesto; }
    public Integer getCantidadPersonas() { return cantidadPersonas; }
    public void setCantidadPersonas(Integer cantidadPersonas) { this.cantidadPersonas = cantidadPersonas; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getOrganizador() { return organizador; }
    public void setOrganizador(String organizador) { this.organizador = organizador; }
    public List<ProductoEventoDTO> getProductos() { return productos; }
    public void setProductos(List<ProductoEventoDTO> productos) { this.productos = productos; }
    public List<ParticipanteEventoDTO> getParticipantes() { return participantes; }
    public void setParticipantes(List<ParticipanteEventoDTO> participantes) { this.participantes = participantes; }
}