package com.basados.api.service;

import com.basados.api.dto.DestinatarioDto;
import com.basados.api.dto.ResumenEventoRequest;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    private static final DeviceRgb COLOR_PRIMARIO = new DeviceRgb(120, 0, 20);
    private static final DeviceRgb COLOR_SECUNDARIO = new DeviceRgb(230, 95, 0);
    private static final DeviceRgb COLOR_FONDO = new DeviceRgb(248, 248, 248);
    private static final DeviceRgb COLOR_BORDE = new DeviceRgb(220, 220, 220);

    public byte[] generarPdfResumen(ResumenEventoRequest request, DestinatarioDto destinatario) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.setMargins(30, 36, 30, 36);

            agregarLogo(document);
            agregarTitulo(document);
            agregarSaludo(document, destinatario);
            agregarBloqueAporte(document, destinatario);
            agregarTablaResumen(document, request);
            agregarPie(document);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Error generando PDF", e);
        }
    }

    private void agregarLogo(Document document) {
        try {
            ClassPathResource logoResource = new ClassPathResource("logo.png");
            byte[] logoBytes = logoResource.getInputStream().readAllBytes();

            Image logo = new Image(ImageDataFactory.create(logoBytes));
            logo.setWidth(110);
            logo.setHorizontalAlignment(HorizontalAlignment.CENTER);

            document.add(logo);
            document.add(new Paragraph(" "));
        } catch (Exception e) {
            System.out.println("⚠️ No se encontró logo.png, se genera PDF sin logo");
        }
    }

    private void agregarTitulo(Document document) {
        Paragraph titulo = new Paragraph("BASADOS")
                .setBold()
                .setFontSize(22)
                .setFontColor(COLOR_PRIMARIO)
                .setTextAlignment(TextAlignment.CENTER);

        Paragraph subtitulo = new Paragraph("Resumen personalizado del evento")
                .setFontSize(12)
                .setFontColor(COLOR_SECUNDARIO)
                .setTextAlignment(TextAlignment.CENTER);

        document.add(titulo);
        document.add(subtitulo);
        document.add(new Paragraph(" "));
    }

    private void agregarSaludo(Document document, DestinatarioDto destinatario) {
        Paragraph saludo = new Paragraph("Hola " + valorSeguro(destinatario.getNombre()))
                .setFontSize(14)
                .setBold()
                .setFontColor(ColorConstants.BLACK);

        Paragraph descripcion = new Paragraph(
                "Te compartimos el resumen de tu participación en el evento organizado con BASADOS."
        ).setFontSize(11);

        document.add(saludo);
        document.add(descripcion);
        document.add(new Paragraph(" "));
    }

    private void agregarBloqueAporte(Document document, DestinatarioDto destinatario) {
        Table bloque = new Table(UnitValue.createPercentArray(new float[]{1}))
                .useAllAvailableWidth();

        Cell celda = new Cell()
                .add(new Paragraph("Tu aporte").setFontSize(11).setFontColor(ColorConstants.WHITE))
                .add(new Paragraph("$" + valorNumero(destinatario.getMonto()))
                        .setFontSize(20)
                        .setBold()
                        .setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(COLOR_PRIMARIO)
                .setBorder(new SolidBorder(COLOR_PRIMARIO, 1))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setPaddingTop(12)
                .setPaddingBottom(12);

        bloque.addCell(celda);
        document.add(bloque);
        document.add(new Paragraph(" "));
    }

    private void agregarTablaResumen(Document document, ResumenEventoRequest request) {
        float[] columnas = {3, 5};
        Table tabla = new Table(UnitValue.createPercentArray(columnas))
                .useAllAvailableWidth();

        tabla.addHeaderCell(crearHeader("Campo"));
        tabla.addHeaderCell(crearHeader("Detalle"));

        tabla.addCell(crearLabel("Evento"));
        tabla.addCell(crearValor(valorSeguro(request.getNombreEvento())));

        tabla.addCell(crearLabel("Fecha"));
        tabla.addCell(crearValor(valorSeguro(request.getFecha())));

        tabla.addCell(crearLabel("Organizador"));
        tabla.addCell(crearValor(valorSeguro(request.getOrganizador())));

        tabla.addCell(crearLabel("Participantes"));
        tabla.addCell(crearValor(String.valueOf(valorNumero(request.getParticipantes()))));

        tabla.addCell(crearLabel("Costo total"));
        tabla.addCell(crearValor("$" + valorNumero(request.getCostoTotal())));

        tabla.addCell(crearLabel("Promedio por persona"));
        tabla.addCell(crearValor("$" + valorNumero(request.getCostoPromedio())));

        tabla.addCell(crearLabel("Calorías totales"));
        tabla.addCell(crearValor(valorNumero(request.getCaloriasTotales()) + " kcal"));

        tabla.addCell(crearLabel("Calorías por persona"));
        tabla.addCell(crearValor(valorNumero(request.getCaloriasPorPersona()) + " kcal"));

        tabla.addCell(crearLabel("Supermercado sugerido"));
        tabla.addCell(crearValor(valorSeguro(request.getCotizacionSeleccionada())));

        document.add(tabla);
        document.add(new Paragraph(" "));
    }

    private Cell crearHeader(String texto) {
        return new Cell()
                .add(new Paragraph(texto).setBold().setFontColor(ColorConstants.WHITE))
                .setBackgroundColor(COLOR_SECUNDARIO)
                .setBorder(new SolidBorder(COLOR_SECUNDARIO, 1))
                .setPadding(8)
                .setTextAlignment(TextAlignment.CENTER);
    }

    private Cell crearLabel(String texto) {
        return new Cell()
                .add(new Paragraph(texto).setBold())
                .setBackgroundColor(COLOR_FONDO)
                .setBorder(new SolidBorder(COLOR_BORDE, 1))
                .setPadding(8);
    }

    private Cell crearValor(String texto) {
        return new Cell()
                .add(new Paragraph(texto))
                .setBorder(new SolidBorder(COLOR_BORDE, 1))
                .setPadding(8);
    }

    private void agregarPie(Document document) {
        Paragraph pie = new Paragraph("Gracias por usar BASADOS 🔥")
                .setTextAlignment(TextAlignment.CENTER)
                .setFontSize(10)
                .setFontColor(ColorConstants.DARK_GRAY);

        document.add(new Paragraph(" "));
        document.add(pie);
    }

    private String valorSeguro(String valor) {
        return valor == null || valor.isBlank() ? "No definido" : valor;
    }

    private int valorNumero(Integer valor) {
        return valor == null ? 0 : valor;
    }
}