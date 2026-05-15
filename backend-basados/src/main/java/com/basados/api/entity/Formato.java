package com.basados.api.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "formatos")
public class Formato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_formato")
    private Long idFormato;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "peso_gramos")
    private BigDecimal pesoGramos;

    public Formato() {}

    public Long getIdFormato() { return idFormato; }
    public void setIdFormato(Long idFormato) { this.idFormato = idFormato; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public BigDecimal getPesoGramos() { return pesoGramos; }
    public void setPesoGramos(BigDecimal pesoGramos) { this.pesoGramos = pesoGramos; }
}