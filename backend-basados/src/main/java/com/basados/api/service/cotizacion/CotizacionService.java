package com.basados.api.service.cotizacion;

import com.basados.api.dto.*;
import com.basados.api.entity.Comercio;
import com.basados.api.entity.HistorialPrecio;
import com.basados.api.entity.Producto;
import com.basados.api.repository.HistorialPrecioRepository;
import com.basados.api.repository.ProductoRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CotizacionService {

    private final ProductoRepository productoRepository;
    private final HistorialPrecioRepository historialPrecioRepository;

    public CotizacionService(
            ProductoRepository productoRepository,
            HistorialPrecioRepository historialPrecioRepository) {
        this.productoRepository = productoRepository;
        this.historialPrecioRepository = historialPrecioRepository;
    }

    public CotizacionResponseDTO generarCotizaciones(CotizacionRequestDTO request) {
        List<Comercio> comercios = historialPrecioRepository.findComerciosActivos();

        List<CotizacionResultadoDTO> resultados = new ArrayList<>();

        for (Comercio comercio : comercios) {
            CotizacionResultadoDTO resultado = generarCotizacionPorComercio(request, comercio);
            if (resultado.getProductosEncontrados() > 0) {
                resultados.add(resultado);
            }
        }

        resultados.sort((a, b) -> a.getTotal().compareTo(b.getTotal()));

        CotizacionResponseDTO response = new CotizacionResponseDTO();
        response.setCotizaciones(resultados);
        return response;
    }

    private CotizacionResultadoDTO generarCotizacionPorComercio(
            CotizacionRequestDTO request,
            Comercio comercio) {

        List<CotizacionItemDTO> items = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;
        int encontrados = 0;
        int faltantes = 0;

        for (CotizacionProductoDTO item : request.getProductos()) {
            Producto producto = productoRepository.findById(item.getIdProducto()).orElse(null);

            if (producto == null) {
                faltantes++;
                continue;
            }

            Optional<HistorialPrecio> historialOpt =
                historialPrecioRepository.findPrecioMasRecientePorComercio(producto, comercio);

            CotizacionItemDTO itemDTO = new CotizacionItemDTO();
            itemDTO.setNombreProducto(producto.getNombre());
            itemDTO.setCantidad(item.getCantidad());

            if (historialOpt.isPresent()) {
                HistorialPrecio historial = historialOpt.get();

                itemDTO.setIdHistorial(historial.getIdHistorial());
                itemDTO.setComercio(comercio.getNombre());

                BigDecimal precio = historial.getPrecioOferta() != null
                    ? historial.getPrecioOferta()
                    : historial.getPrecio();

                BigDecimal subtotal = precio.multiply(BigDecimal.valueOf(item.getCantidad()));

                itemDTO.setEncontrado(true);
                itemDTO.setPrecioUnitario(precio);
                itemDTO.setPrecioUnitarioTexto(historial.getPrecioUnitario());
                itemDTO.setSubtotal(subtotal);

                total = total.add(subtotal);
                encontrados++;

            } else {
                itemDTO.setEncontrado(false);
                itemDTO.setPrecioUnitario(null);
                itemDTO.setPrecioUnitarioTexto(null);
                itemDTO.setSubtotal(null);
                faltantes++;
            }

            items.add(itemDTO);
        }

        CotizacionResultadoDTO resultado = new CotizacionResultadoDTO();
        resultado.setComercio(comercio.getNombre());
        resultado.setTotal(total);
        resultado.setProductosEncontrados(encontrados);
        resultado.setProductosFaltantes(faltantes);
        resultado.setItems(items);
        return resultado;
    }
}