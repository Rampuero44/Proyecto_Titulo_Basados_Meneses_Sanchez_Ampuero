package com.basados.api.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Long idProducto;

    @Column(name = "nombre", nullable = false, length = 200)
    private String nombre;

    @Column(name = "descripcion", length = 500)
    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "id_categoria", nullable = false)
    private CategoriaProducto categoria;

    @ManyToOne
    @JoinColumn(name = "id_marca")
    private Marca marca;

    @ManyToOne
    @JoinColumn(name = "id_formato")
    private Formato formato;

    @ManyToOne
    @JoinColumn(name = "id_tipo")
    private Tipo tipo;

    @Column(name = "calorias")
    private BigDecimal calorias;

    @Column(name = "proteinas")
    private BigDecimal proteinas;

    @Column(name = "grasas")
    private BigDecimal grasas;

    @Column(name = "carbohidratos")
    private BigDecimal carbohidratos;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "alcoholico")
    private Boolean alcoholico;

    @Column(name = "activo")
    private Boolean activo;

    @Column(name = "fecha_eliminacion")
    private LocalDateTime fechaEliminacion;

    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion;

    public Producto() {}

    public Long getIdProducto() { return idProducto; }
    public void setIdProducto(Long idProducto) { this.idProducto = idProducto; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public CategoriaProducto getCategoria() { return categoria; }
    public void setCategoria(CategoriaProducto categoria) { this.categoria = categoria; }

    public Marca getMarca() { return marca; }
    public void setMarca(Marca marca) { this.marca = marca; }

    public Formato getFormato() { return formato; }
    public void setFormato(Formato formato) { this.formato = formato; }

    public Tipo getTipo() { return tipo; }
    public void setTipo(Tipo tipo) { this.tipo = tipo; }

    public BigDecimal getCalorias() { return calorias; }
    public void setCalorias(BigDecimal calorias) { this.calorias = calorias; }

    public BigDecimal getProteinas() { return proteinas; }
    public void setProteinas(BigDecimal proteinas) { this.proteinas = proteinas; }

    public BigDecimal getGrasas() { return grasas; }
    public void setGrasas(BigDecimal grasas) { this.grasas = grasas; }

    public BigDecimal getCarbohidratos() { return carbohidratos; }
    public void setCarbohidratos(BigDecimal carbohidratos) { this.carbohidratos = carbohidratos; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }

    public Boolean getAlcoholico() { return alcoholico; }
    public void setAlcoholico(Boolean alcoholico) { this.alcoholico = alcoholico; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public LocalDateTime getFechaEliminacion() { return fechaEliminacion; }
    public void setFechaEliminacion(LocalDateTime fechaEliminacion) { this.fechaEliminacion = fechaEliminacion; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}