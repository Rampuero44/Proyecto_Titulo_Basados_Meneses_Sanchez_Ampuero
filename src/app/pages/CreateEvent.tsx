import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { generateId } from "../utils/generateId";
import { esMayorDeEdad } from "../utils/age";
import { tieneProductosAlcoholicos } from "../utils/alcohol";
import { Participante } from "../types/product";
import { generarCotizacion } from "../services/cotizacionesApi";
import { enviarResumenEvento } from "../services/notificacionApi";
import { toast } from "sonner";
import { CostSplitParticipant, CostSplitStep } from "../components/CostSplitStep";
import { ProductCatalogStep, ProductoSeleccionado } from "../components/ProductCatalogStep";
import { crearEvento } from "../services/eventosApi";
import { crearEventoProducto } from "../services/eventoProductosApi";
import { AsadorStep } from "../components/AsadorStep";
import { MaestroParrillero } from "../services/asadoresApi";
import { ModalContextoEvento, ContextoEvento } from "../components/ModalContextoEvento";
import { IaSugerencias } from "../components/IaSugerencias";
import { ModalBorrador } from "../components/ModalBorrador";
import { ModalAuthRequerido } from "../components/ModalAuthRequerido";
import { ModalVerificacionEdad } from "../components/ModalVerificacionEdad";
import { QuoteStep } from "../components/QuoteStep";
import { ConfigStep } from "../components/ConfigStep";
import { useAuth } from "../context/AuthContext";
import { obtenerBorrador } from "../services/eventosApi";

const formatDateForInput = (date: Date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split("T")[0];
};

export function CreateEvent() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const currentUsuario = user ? {
    id: user.id,
    nombre: user.user_metadata?.nombre ?? user.email ?? "Usuario",
    email: user.email ?? "",
    fechaNacimiento: user.user_metadata?.fecha_nacimiento ?? null,
  } : null;
  const esInvitado = !currentUsuario;
  const [step, setStep] = useState<"catalog" | "asador" | "config" | "quote" | "cost">("catalog");
  const [mostrarModalEdad, setMostrarModalEdad] = useState(false);
  const [edadVerificada, setEdadVerificada] = useState(false);
  const [esMayor, setEsMayor] = useState<boolean | null>(null);
  const [seleccionados, setSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [asadorSeleccionado, setAsadorSeleccionado] = useState<MaestroParrillero | null>(null);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(formatDateForInput(new Date()));
  const [direccion, setDireccion] = useState("");
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nuevoParticipante, setNuevoParticipante] = useState("");
  const [selectedComercio, setSelectedComercio] = useState<string>("");
  const [cotizaciones, setCotizaciones] = useState<any[]>([]);
  const [contextoEvento, setContextoEvento] = useState<ContextoEvento | null>(null);
  const [mostrarModalBorrador, setMostrarModalBorrador] = useState(false);
  const [mostrarModalAuth, setMostrarModalAuth] = useState(false);
  const [vieneDeModalAuth, setVieneDeModalAuth] = useState(false);
  const [borradorId, setBorradorId] = useState<string | null>(null);
  const [borradorRevisado, setBorradorRevisado] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (currentUsuario && !borradorRevisado) {
      setBorradorRevisado(true);
      obtenerBorrador(currentUsuario.id).then((borrador) => {
        if (borrador) {
          setBorradorId(borrador.id);
          setMostrarModalBorrador(true);
        } else {
          inicializarNuevoEvento();
        }
      }).catch(() => inicializarNuevoEvento());
      return;
    }
    if (!currentUsuario && !borradorRevisado) {
      setBorradorRevisado(true);
      setNombre("Mi asado");
    }
  }, [currentUsuario, loading, borradorRevisado]);

  const inicializarNuevoEvento = () => {
    if (!currentUsuario) return;
    setNombre(`Evento de ${currentUsuario.nombre}`);
    setParticipantes((prev) => {
      const exists = prev.some(
        (p) => p.nombre.trim().toLowerCase() === currentUsuario.nombre.trim().toLowerCase()
      );
      if (exists) return prev;
      return [
        {
          id: generateId(),
          nombre: currentUsuario.nombre,
          contactos: [{ id: generateId(), metodo: "email", valor: currentUsuario.email }],
          metodoContacto: "correo",
          contacto: currentUsuario.email,
          esOrganizador: true,
        },
        ...prev,
      ];
    });
  };

  const handleContinuarBorrador = () => {
    setMostrarModalBorrador(false);
  };

  const handleNuevoEvento = () => {
    setMostrarModalBorrador(false);
    setBorradorId(null);
    inicializarNuevoEvento();
  };

  const handleStepCost = () => {
    if (esInvitado) {
      setVieneDeModalAuth(true);
      setMostrarModalAuth(true);
    } else {
      setStep("cost");
    }
  };

  const handleAutenticado = () => {
    setMostrarModalAuth(false);
    setBorradorRevisado(true);

    if (user) {
      const fechaNac = user.user_metadata?.fecha_nacimiento ?? user.user_metadata?.fechaNacimiento ?? null;
      if (fechaNac) {
        const mayor = esMayorDeEdad(fechaNac);
        if (!mayor) {
          const sinAlcohol = seleccionados.filter(
            (s) => !(s.product.categoria?.toLowerCase().includes("bebida") && s.product.alcoholico === true)
          );
          if (sinAlcohol.length !== seleccionados.length) {
            setSeleccionados(sinAlcohol);
            toast.warning(
              "Como eres menor de edad, las bebidas alcohólicas fueron retiradas de tu selección.",
              { duration: 5000 }
            );
          }
          setEsMayor(false);
          setEdadVerificada(true);
        }
      }
    }
  };

  useEffect(() => {
    if (!mostrarModalAuth && currentUsuario && step === "quote" && vieneDeModalAuth) {
      setVieneDeModalAuth(false);
      inicializarNuevoEvento();
      setStep("cost");
    }
  }, [currentUsuario, mostrarModalAuth, step]);

  const getByCategory = (categoria: string) =>
    seleccionados
      .filter((s) =>
        s.product.categoria?.toLowerCase().includes(categoria.toLowerCase())
      )
      .map((s) => ({
        id: generateId(),
        nombre: s.product.nombre,
        tipo: s.product.categoria,
        cantidad: s.cantidad,
        porPrecio: 0,
        calorias: s.product.calorias ?? 0,
      }));

  const proteinas = getByCategory("carne");
  const bebestibles = getByCategory("bebida");
  const ensaladas = getByCategory("ensalada");
  const insumos = getByCategory("insumo");
  const costoAsador = asadorSeleccionado ? asadorSeleccionado.valorServicio : 0;
  const caloriasTotales = seleccionados.reduce(
    (sum, s) => sum + ((s.product.calorias ?? 0) * s.cantidad),
    0
  );
  const caloriasPorPersona = participantes.length > 0 ? caloriasTotales / participantes.length : 0;
  const mejorCotizacion = cotizaciones[0] || null;
  const cotizacionActiva =
    cotizaciones.find((c) => c.comercio === selectedComercio) || mejorCotizacion;
  const costoEstimado = seleccionados.reduce((sum, s) => {
    return sum + (s.product.precioDesde ?? 0) * s.cantidad;
  }, 0);
  const costoTotal =
    cotizacionActiva?.total
      ? Number(cotizacionActiva.total)
      : costoEstimado;

  useEffect(() => {
    if (mejorCotizacion && !selectedComercio) {
      setSelectedComercio(mejorCotizacion.comercio);
    }
  }, [mejorCotizacion, selectedComercio]);

  const cargarCotizaciones = async () => {
    try {
      const request = {
        productos: seleccionados.map((s) => ({
          idProducto: s.product.id,
          cantidad: s.cantidad,
        })),
      };
      const response = await generarCotizacion(request);
      setCotizaciones(response.cotizaciones || []);
    } catch (error) {
      console.error("Error cargando cotizaciones:", error);
      toast.error("No fue posible generar cotizaciones");
    }
  };

  const handleConfirmarEdad = (mayor: boolean, fechaNac: string) => {
    setMostrarModalEdad(false);
    setEdadVerificada(true);
    setEsMayor(mayor);
    let productosFinales = seleccionados;
    if (!mayor) {
      productosFinales = seleccionados.filter(
        (s) => !(s.product.categoria?.toLowerCase().includes("bebida") && s.product.alcoholico === true)
      );
      setSeleccionados(productosFinales);
      toast.warning(
        "Como eres menor de edad, las bebidas alcohólicas fueron retiradas de tu selección.",
        { duration: 5000 }
      );
    } else {
      toast.success("Edad verificada. Puedes continuar con tu selección.");
    }
    if (productosFinales.length === 0) {
      toast.error("No quedan productos en tu selección. Agrega al menos un producto no alcohólico para continuar.", { duration: 6000 });
      return;
    }
    setStep("asador");
  };

  const validarCatalogo = () => {
    if (seleccionados.length === 0) {
      toast.error("Selecciona al menos un producto para continuar");
      return false;
    }
    return true;
  };

  const handleContinuarDesdeCatalogo = () => {
    if (!validarCatalogo()) return;
    if (tieneProductosAlcoholicos(seleccionados)) {
      if (currentUsuario?.fechaNacimiento) {
        const mayor = esMayorDeEdad(currentUsuario.fechaNacimiento);
        if (!mayor) {
          const sinAlcohol = seleccionados.filter(
            (s) => !(s.product.categoria?.toLowerCase().includes("bebida") && s.product.alcoholico === true)
          );
          if (sinAlcohol.length === 0) {
            toast.error("No puedes continuar: eres menor de edad y solo seleccionaste bebidas alcohólicas. Agrega otros productos.", { duration: 6000 });
            return;
          }
          setSeleccionados(sinAlcohol);
          toast.warning(
            "Como eres menor de edad, las bebidas alcohólicas fueron retiradas de tu selección.",
            { duration: 5000 }
          );
        }
        setEsMayor(mayor);
        setEdadVerificada(true);
        setStep("asador");
        return;
      }
      if (!edadVerificada) {
        setMostrarModalEdad(true);
        return;
      }
    }
    setStep("asador");
  };

  const handleAgregarParticipante = () => {
    const nombreP = nuevoParticipante.trim();
    if (!nombreP) { toast.error("Ingresa un nombre para el participante"); return; }
    if (participantes.some((p) => p.nombre.trim().toLowerCase() === nombreP.toLowerCase())) {
      toast.error("Ese participante ya fue agregado"); return;
    }
    setParticipantes((prev) => [
      ...prev,
      { id: generateId(), nombre: nombreP, contactos: [], metodoContacto: "sin_notificacion", contacto: "", esOrganizador: false },
    ]);
    setNuevoParticipante("");
    toast.success("Participante agregado");
  };

  const handleEliminarParticipante = (id: number) => {
    if (participantes.find((p) => p.id === id)?.esOrganizador) {
      toast.error("El organizador siempre participa en el evento"); return;
    }
    setParticipantes((prev) => prev.filter((p) => p.id !== id));
  };

  const validarConfiguracion = () => {
    if (!nombre.trim()) { toast.error("Debes ingresar un nombre para el evento"); return false; }
    if (!fecha) { toast.error("Debes seleccionar una fecha"); return false; }
    if (!direccion.trim()) { toast.error("Debes ingresar la dirección del evento"); return false; }
    if (participantes.length < 2) {
      toast.error("Un asado necesita al menos 2 participantes 🔥");
      return false;
    }
    return true;
  };

  const handleContinuarDesdeConfig = async () => {
    if (!validarConfiguracion()) return;
    await cargarCotizaciones();
    setStep("quote");
  };

  const handleGuardarEvento = async (participantesConCostos: CostSplitParticipant[]) => {
    if (!currentUsuario || !cotizacionActiva) return;
    try {
      const presupuestoFinal = Math.round(
        participantesConCostos.reduce((sum, p) => sum + p.monto, 0)
      );
      const eventoCreado = await crearEvento({
        nombre: nombre.trim(),
        descripcion: "Evento creado desde frontend",
        fechaEvento: `${fecha}T20:00:00`,
        direccion: direccion.trim() || "Sin dirección",
        presupuesto: presupuestoFinal,
        cantidadPersonas: participantes.length,
        estado: "PLANIFICANDO",
        idOrganizador: currentUsuario.id,
      });
      const eventoId = eventoCreado.id;
      for (const seleccionado of seleccionados) {
        await crearEventoProducto({
          idEvento: eventoId,
          idProducto: seleccionado.product.id,
          idHistorial: cotizacionActiva?.items?.find(
            (item: any) => item.nombreProducto === seleccionado.product.nombre
          )?.idHistorial,
          cantidad: seleccionado.cantidad,
          seleccionado: true,
        });
      }
      toast.success("Evento creado correctamente");
      try {
        const destinatarios = participantesConCostos
          .filter(p => p.metodoContacto !== "sin_notificacion" && p.contacto?.trim())
          .map(p => ({
            nombre: p.nombre,
            canal: p.metodoContacto === "correo" ? "email" : "whatsapp" as "email" | "whatsapp",
            destino: p.contacto!,
            monto: Math.round(p.monto),
          }));
        await enviarResumenEvento({
          eventoId: eventoId,
          nombreEvento: nombre.trim(),
          fecha,
          organizador: currentUsuario.nombre,
          organizadorEmail: currentUsuario.email,
          participantes: participantesConCostos.length,
          costoTotal: presupuestoFinal,
          costoPromedio: Math.round(presupuestoFinal / Math.max(participantesConCostos.length, 1)),
          caloriasTotales: Math.round(caloriasTotales),
          caloriasPorPersona: Math.round(caloriasPorPersona),
          cotizacionSeleccionada: cotizacionActiva.comercio,
          direccion: direccion.trim(),
          destinatarios,
        });
      } catch {
        console.warn("Notificaciones no enviadas, pero el evento fue creado correctamente");
      }
      navigate(`/event/${eventoId}`);
    } catch (error) {
      console.error("Error creando evento:", error);
      toast.error("Error creando el evento");
    }
  };

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
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>

        {step === "cost" && cotizacionActiva ? (
          <CostSplitStep
            participantes={participantes}
            total={cotizacionActiva.total}
            costoAlcoholTotal={0}
            onBack={() => setStep("quote")}
            onConfirm={handleGuardarEvento}
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
