package com.basados.api.service.cotizacion;

import com.basados.api.dto.*;
import com.basados.api.entity.Producto;
import com.basados.api.repository.ProductoRepository;
import com.basados.api.service.scraping.*;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class CotizacionService {

    private final ProductoRepository productoRepository;

    private final JumboScrapingService jumboService;

    private final LiderScrapingService liderService;

    private final TottusScrapingService tottusService;

    public CotizacionService(
            ProductoRepository productoRepository,
            JumboScrapingService jumboService,
            LiderScrapingService liderService,
            TottusScrapingService tottusService
    ) {

        this.productoRepository =
                productoRepository;

        this.jumboService =
                jumboService;

        this.liderService =
                liderService;

        this.tottusService =
                tottusService;
    }

    public CotizacionResponseDTO generarCotizaciones(
            CotizacionRequestDTO request
    ) {

        List<CotizacionResultadoDTO> resultados =
                new ArrayList<>();

        resultados.add(
                generarCotizacion(
                        jumboService,
                        request
                )
        );

        resultados.add(
                generarCotizacion(
                        liderService,
                        request
                )
        );

        resultados.add(
                generarCotizacion(
                        tottusService,
                        request
                )
        );

        CotizacionResponseDTO response =
                new CotizacionResponseDTO();

        response.setCotizaciones(
                resultados
        );

        return response;
    }

    private CotizacionResultadoDTO generarCotizacion(
            ScrapingService scrapingService,
            CotizacionRequestDTO request
    ) {

        List<CotizacionItemDTO> items =
                new ArrayList<>();

        BigDecimal total =
                BigDecimal.ZERO;

        int encontrados = 0;

        int faltantes = 0;

        for (CotizacionProductoDTO item :
                request.getProductos()) {

            Producto producto =
                    productoRepository.findById(
                            item.getIdProducto()
                    ).orElse(null);

            if (producto == null) {

                faltantes++;

                continue;
            }

            ScrapingResultado scraping =
                    scrapingService.buscarProducto(
                            producto
                    );

            CotizacionItemDTO itemDTO =
                    new CotizacionItemDTO();

            itemDTO.setNombreProducto(
                    producto.getNombre()
            );

            itemDTO.setCantidad(
                    item.getCantidad()
            );

            if (scraping.isDisponible()) {

                BigDecimal subtotal =
                        scraping.getPrecio()
                                .multiply(
                                        BigDecimal.valueOf(
                                                item.getCantidad()
                                        )
                                );

                itemDTO.setEncontrado(true);

                itemDTO.setPrecioUnitario(
                        scraping.getPrecio()
                );

                itemDTO.setSubtotal(
                        subtotal
                );

                total = total.add(
                        subtotal
                );

                encontrados++;

            } else {

                itemDTO.setEncontrado(false);

                itemDTO.setPrecioUnitario(null);

                itemDTO.setSubtotal(null);

                faltantes++;
            }

            items.add(itemDTO);
        }

        CotizacionResultadoDTO resultado =
                new CotizacionResultadoDTO();

        resultado.setComercio(
                scrapingService.getNombreComercio()
        );

        resultado.setTotal(
                total
        );

        resultado.setProductosEncontrados(
                encontrados
        );

        resultado.setProductosFaltantes(
                faltantes
        );

        resultado.setItems(
                items
        );

        return resultado;
    }
}