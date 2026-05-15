package com.basados.api.service.scraping;

import com.basados.api.entity.Producto;

public interface ScrapingService {

    String getNombreComercio();

    ScrapingResultado buscarProducto(
            Producto producto
    );
}