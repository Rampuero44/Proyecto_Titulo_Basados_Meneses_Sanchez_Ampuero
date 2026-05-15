package com.basados.api.dto;

import java.util.List;

public class CotizacionResponseDTO {

    private List<CotizacionResultadoDTO> cotizaciones;

    public CotizacionResponseDTO() {
    }

    public List<CotizacionResultadoDTO> getCotizaciones() {
        return cotizaciones;
    }

    public void setCotizaciones(List<CotizacionResultadoDTO> cotizaciones) {
        this.cotizaciones = cotizaciones;
    }
}