import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CostSplitStep } from "../components/CostSplitStep";
import { ProductCatalogStep } from "../components/ProductCatalogStep";
import { AsadorStep } from "../components/AsadorStep";
import { ModalContextoEvento } from "../components/ModalContextoEvento";
import { IaSugerencias } from "../components/IaSugerencias";
import { ModalBorrador } from "../components/ModalBorrador";
import { ModalAuthRequerido } from "../components/ModalAuthRequerido";
import { ModalVerificacionEdad } from "../components/ModalVerificacionEdad";
import { QuoteStep } from "../components/QuoteStep";
import { ConfigStep } from "../components/ConfigStep";
import { useCreateEvent } from "../hooks/useCreateEvent";

export function CreateEvent() {
  const navigate = useNavigate();
  const {
    loading,
    step, setStep,
    mostrarModalEdad,
    edadVerificada,
    esMayor,
    seleccionados, setSeleccionados,
    asadorSeleccionado, setAsadorSeleccionado,
    nombre, setNombre,
    fecha, setFecha,
    direccion, setDireccion,
    participantes,
    nuevoParticipante, setNuevoParticipante,
    selectedComercio, setSelectedComercio,
    cotizaciones,
    contextoEvento, setContextoEvento,
    mostrarModalBorrador,
    mostrarModalAuth, setMostrarModalAuth,
    costoAsador,
    caloriasTotales, caloriasPorPersona,
    cotizacionActiva,
    costoTotal,
    costoAlcoholTotal,
    handleContinuarBorrador,
    handleNuevoEvento,
    handleStepCost,
    handleAutenticado,
    handleConfirmarEdad,
    handleContinuarDesdeCatalogo,
    handleAgregarParticipante,
    handleEliminarParticipante,
    handleContinuarDesdeConfig,
    handleGuardarEvento,
  } = useCreateEvent();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {mostrarModalEdad && (
        <ModalVerificacionEdad onConfirmar={handleConfirmarEdad} />
      )}
      {mostrarModalBorrador && (
        <ModalBorrador
          onContinuar={handleContinuarBorrador}
          onNuevo={handleNuevoEvento}
        />
      )}
      {mostrarModalAuth && (
        <ModalAuthRequerido
          onAutenticado={handleAutenticado}
          onCancelar={() => setMostrarModalAuth(false)}
        />
      )}
      {!mostrarModalBorrador && !contextoEvento && (
        <ModalContextoEvento onConfirmar={setContextoEvento} />
      )}
      <div className="container mx-auto max-w-6xl px-4 pt-8 pb-20">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        {step === "cost" && cotizacionActiva ? (
          <CostSplitStep
            participantes={participantes}
            total={cotizacionActiva.total}
            costoAlcoholTotal={costoAlcoholTotal}
            onBack={() => setStep("quote")}
            onConfirm={async (participantesConCostos) => {
              const eventoId = await handleGuardarEvento(participantesConCostos);
              if (eventoId) navigate(`/event/${eventoId}`);
            }}
          />
        ) : step === "quote" ? (
          <QuoteStep
            cotizaciones={cotizaciones}
            cotizacionActiva={cotizacionActiva}
            selectedComercio={selectedComercio}
            onSelectComercio={setSelectedComercio}
            caloriasTotales={caloriasTotales}
            caloriasPorPersona={caloriasPorPersona}
            contextoEvento={contextoEvento}
            seleccionados={seleccionados}
            onBack={() => setStep("config")}
            onContinue={handleStepCost}
          />
        ) : step === "asador" ? (
          <div className="space-y-6">
            <AsadorStep
              cantParticipantes={Math.max(participantes.length, 1)}
              asadorSeleccionado={asadorSeleccionado}
              onChange={setAsadorSeleccionado}
              seleccionados={seleccionados}
              cotizacionTotal={costoTotal}
            />
            <div className="fixed bottom-6 right-6 z-50 flex gap-3">
              <Button variant="outline" onClick={() => setStep("catalog")}>Volver al catálogo</Button>
              <Button onClick={() => setStep("config")}>Siguiente Paso</Button>
            </div>
          </div>
        ) : step === "config" ? (
          <ConfigStep
            seleccionados={seleccionados}
            edadVerificada={edadVerificada}
            esMayor={esMayor}
            costoTotal={costoTotal}
            cotizacionActiva={cotizacionActiva}
            nombre={nombre}
            onNombreChange={setNombre}
            fecha={fecha}
            onFechaChange={setFecha}
            direccion={direccion}
            onDireccionChange={setDireccion}
            participantes={participantes}
            nuevoParticipante={nuevoParticipante}
            onNuevoParticipanteChange={setNuevoParticipante}
            onAgregarParticipante={handleAgregarParticipante}
            onEliminarParticipante={handleEliminarParticipante}
            asadorSeleccionado={asadorSeleccionado}
            costoAsador={costoAsador}
            caloriasTotales={caloriasTotales}
            caloriasPorPersona={caloriasPorPersona}
            onEditarProductos={() => setStep("catalog")}
            onBack={() => setStep("asador")}
            onContinue={handleContinuarDesdeConfig}
          />
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crear evento</h1>
              <p className="mt-2 text-muted-foreground">
                Elige los productos para tu asado, luego configura el evento y reparte el costo.
              </p>
            </div>
            <ProductCatalogStep
              seleccionados={seleccionados}
              onChange={setSeleccionados}
              ocultarAlcohol={esMayor === false}
              sidebarExtra={contextoEvento ? (
                <IaSugerencias
                  contexto={contextoEvento}
                  productos={seleccionados.map((s) => ({
                    nombre: s.product.nombre,
                    cantidad: s.cantidad,
                    slugCategoria: s.product.slugCategoria ?? s.product.categoria,
                    precioUnitario: s.product.precioUnitario,
                  }))}
                />
              ) : undefined}
            />
            <div className="fixed bottom-6 right-6 z-50">
              <Button size="lg" onClick={handleContinuarDesdeCatalogo} className="shadow-lg shadow-primary/30">
                Siguiente paso →
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
