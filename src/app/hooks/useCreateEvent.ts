import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { generateId } from "../utils/generateId";
import { esMayorDeEdad } from "../utils/age";
import { tieneProductosAlcoholicos, filtrarAlcohol } from "../utils/alcohol";
import { calcularCostoFiltrado } from "../utils/costos";
import { Cotizacion, CotizacionItem, Participante } from "../types/product";
import { generarCotizacion } from "../services/cotizacionesApi";
import { enviarResumenEvento } from "../services/notificacionApi";
import { CostSplitParticipant } from "../components/CostSplitStep";
import { ProductoSeleccionado } from "../components/ProductCatalogStep";
import { crearEventoCompleto, obtenerBorrador, obtenerDetalleEvento } from "../services/eventosApi";
import { MaestroParrillero } from "../services/asadoresApi";
import { ContextoEvento } from "../components/ModalContextoEvento";
import { useAuth } from "../context/AuthContext";

const formatDateForInput = (date: Date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split("T")[0];
};

export type CreateEventStep = "catalog" | "asador" | "config" | "quote" | "cost";

export function useCreateEvent() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const forzarNuevo = searchParams.get("nuevo") === "true";

  const currentUsuario = user ? {
    id: user.id,
    nombre: user.user_metadata?.nombre ?? user.email ?? "Usuario",
    email: user.email ?? "",
    fechaNacimiento: user.user_metadata?.fecha_nacimiento ?? user.user_metadata?.fechaNacimiento ?? null,
  } : null;
  const esInvitado = !currentUsuario;

  const [step, setStep] = useState<CreateEventStep>("catalog");
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
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
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
      if (forzarNuevo) {
        inicializarNuevoEvento();
        return;
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUsuario?.id, loading, borradorRevisado]);

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

  const handleContinuarBorrador = async () => {
    setMostrarModalBorrador(false);

    if (!borradorId) {
      inicializarNuevoEvento();
      return;
    }

    try {
      const detalle = await obtenerDetalleEvento(borradorId);
      inicializarNuevoEvento();

      const productosRestaurados: ProductoSeleccionado[] = detalle.productos.map((p) => ({
        product: {
          id: p.idProducto,
          nombre: p.nombre,
          categoria: p.slugCategoria ?? "",
          slugCategoria: p.slugCategoria ?? undefined,
          precioDesde: p.precioUnitario ?? undefined,
        },
        cantidad: p.cantidad,
      }));
      setSeleccionados(productosRestaurados);

      if (detalle.nombre) setNombre(detalle.nombre);
      if (detalle.fechaEvento) setFecha(detalle.fechaEvento.split("T")[0]);
      if (detalle.direccion) setDireccion(detalle.direccion);

      setStep("config");
    } catch (error) {
      console.error("Error restaurando borrador:", error);
      toast.error("No se pudo cargar tu asado anterior. Empezando uno nuevo.");
    }
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
          const sinAlcohol = filtrarAlcohol(seleccionados);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const costoAlcoholTotal = calcularCostoFiltrado(
    seleccionados,
    cotizacionActiva,
    (product) => product.alcoholico === true
  );

  useEffect(() => {
    if (mejorCotizacion && !selectedComercio) {
      setSelectedComercio(mejorCotizacion.comercio);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleConfirmarEdad = (mayor: boolean, _fechaNac: string) => {
    setMostrarModalEdad(false);
    setEdadVerificada(true);
    setEsMayor(mayor);
    let productosFinales = seleccionados;
    if (!mayor) {
      productosFinales = filtrarAlcohol(seleccionados);
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
      if (currentUsuario?.fechaNacimiento) {        const mayor = esMayorDeEdad(currentUsuario.fechaNacimiento);
        if (!mayor) {
          const sinAlcohol = filtrarAlcohol(seleccionados);
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
    if (!currentUsuario || !cotizacionActiva) return null;
    try {
      const presupuestoFinal = Math.round(
        participantesConCostos.reduce((sum, p) => sum + p.monto, 0)
      );
      const eventoCreado = await crearEventoCompleto({
        nombre: nombre.trim(),
        descripcion: "Evento creado desde frontend",
        fechaEvento: `${fecha}T20:00:00`,
        direccion: direccion.trim() || "Sin dirección",
        presupuesto: presupuestoFinal,
        cantidadPersonas: participantes.length,
        estado: "PLANIFICANDO",
        idOrganizador: currentUsuario.id,
        productos: seleccionados.map((seleccionado) => ({
          idProducto: seleccionado.product.id,
          idHistorial: cotizacionActiva?.items?.find(
            (item: CotizacionItem) => item.nombreProducto === seleccionado.product.nombre
          )?.idHistorial,
          cantidad: seleccionado.cantidad,
          seleccionado: true,
        })),
      });
      const eventoId = eventoCreado.id;
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
      return eventoId;
    } catch (error) {
      console.error("Error creando evento:", error);
      toast.error("Error creando el evento");
      return null;
    }
  };

  return {
    loading,
    esInvitado,
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
    proteinas, bebestibles, ensaladas, insumos,
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
  };
}