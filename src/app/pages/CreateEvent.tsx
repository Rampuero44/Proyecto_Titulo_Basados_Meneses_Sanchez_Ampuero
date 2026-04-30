import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, Calendar, Plus, ShoppingCart, Trophy, X, AlertTriangle, Wine } from "lucide-react";
import { storage, generateId, Participante, esMayorDeEdad } from "../utils/localStorage";
import { generarCotizacionesSimuladas } from "../utils/calculator";
import { toast } from "sonner";
import { CostSplitParticipant, CostSplitStep } from "../components/CostSplitStep";
import { ProductCatalogStep, ProductoSeleccionado } from "../components/ProductCatalogStep";
import { AsadorStep } from "../components/AsadorStep";
import { Asador } from "../data/mockAsadores";

// ─── helpers ─────────────────────────────────────────────────────────────────

const formatDateForInput = (date: Date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split("T")[0];
};

const formatCalories = (value: number) => `${Math.round(value).toLocaleString()} kcal`;

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);

// Tipos de bebestibles que se consideran alcohólicos
const TIPOS_ALCOHOL = ["cerveza", "vino", "licor", "pisco", "ron", "vodka", "whisky", "champagne", "sidra"];

const esAlcohol = (tipo: string): boolean =>
  TIPOS_ALCOHOL.some((a) => tipo.toLowerCase().includes(a));

const tieneAlcohol = (seleccionados: ProductoSeleccionado[]): boolean =>
  seleccionados.some(
    (s) => s.product.category === "bebestible" && esAlcohol(s.product.tipo)
  );

// ─── Modal verificación de edad ───────────────────────────────────────────────

interface ModalEdadProps {
  onConfirmar: (esMayor: boolean, fechaNacimiento: string) => void;
}

function ModalVerificacionEdad({ onConfirmar }: ModalEdadProps) {
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [error, setError] = useState("");
  const fechaMaxima = new Date().toISOString().split("T")[0];

  const handleVerificar = () => {
    if (!fechaNacimiento) {
      setError("Debes ingresar tu fecha de nacimiento");
      return;
    }
    const mayor = esMayorDeEdad(fechaNacimiento);
    onConfirmar(mayor, fechaNacimiento);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
            <Wine className="h-7 w-7 text-amber-600" />
          </div>
          <CardTitle>Verificación de edad</CardTitle>
          <CardDescription>
            Tu selección incluye bebidas alcohólicas. Necesitamos verificar tu edad para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fecha-modal">Fecha de nacimiento</Label>
            <Input
              id="fecha-modal"
              type="date"
              max={fechaMaxima}
              value={fechaNacimiento}
              onChange={(e) => { setFechaNacimiento(e.target.value); setError(""); }}
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <Button className="w-full" onClick={handleVerificar}>
            Verificar edad
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Solo usamos esta fecha para verificar tu edad. No se almacena si no estás registrado.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function CreateEvent() {
  const navigate = useNavigate();

  const [currentUsuario] = useState(
    () => storage.getCurrentUsuario() || storage.getUsuarioByEmail("juan@gmail.com") || null
  );

  // Wizard: catalog → [age-check] → config → quote → cost
  const [step, setStep] = useState<"catalog" | "asador" | "config" | "quote" | "cost">("catalog");

  // Control del modal de verificación de edad
  const [mostrarModalEdad, setMostrarModalEdad] = useState(false);
  const [edadVerificada, setEdadVerificada] = useState(false);
  const [esMayor, setEsMayor] = useState<boolean | null>(null);

  const [seleccionados, setSeleccionados] = useState<ProductoSeleccionado[]>([]);
  const [asadorSeleccionado, setAsadorSeleccionado] = useState<Asador | null>(null);
  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(formatDateForInput(new Date()));
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nuevoParticipante, setNuevoParticipante] = useState("");
  const [selectedSupermercado, setSelectedSupermercado] = useState<string>("");

  useEffect(() => {
    if (!currentUsuario) { navigate("/login"); return; }
    if (!storage.getCurrentUsuario()) storage.setCurrentUsuario(currentUsuario);
    setNombre((prev) => prev || `Evento de ${currentUsuario.nombre}`);
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
  }, [currentUsuario, navigate]);

  // ── Derivar listas por categoría ──────────────────────────────────────────

  const getByCategory = (category: string) =>
    seleccionados
      .filter((s) => s.product.category === category)
      .map((s) => ({
        id: generateId(),
        nombre: s.product.nombre,
        tipo: s.product.tipo,
        cantidad: s.cantidad,
        porPrecio: s.product.precio.valor,
        calorias: s.product.calorias,
      }));

  const proteinas    = getByCategory("proteina");
  const bebestibles  = getByCategory("bebestible");
  const ensaladas    = getByCategory("ensalada");
  const insumos      = getByCategory("insumo");

  const costoTotal = seleccionados.reduce((sum, s) => sum + s.product.precio.valor * s.cantidad, 0);
  const costoAsador = asadorSeleccionado
    ? asadorSeleccionado.tarifaBase + asadorSeleccionado.tarifaPorPersona * participantes.length
    : 0;
  const caloriasTotales = seleccionados.reduce((sum, s) => sum + s.product.calorias * s.cantidad, 0);
  const caloriasPorPersona = participantes.length > 0 ? caloriasTotales / participantes.length : 0;

  const cotizaciones = generarCotizacionesSimuladas(proteinas, bebestibles, ensaladas, insumos);
  const mejorCotizacion = cotizaciones[0] || null;
  const cotizacionActiva =
    cotizaciones.find((c) => c.supermercado === selectedSupermercado) || mejorCotizacion;

  useEffect(() => {
    if (mejorCotizacion && !selectedSupermercado) {
      setSelectedSupermercado(mejorCotizacion.supermercado);
    }
  }, [mejorCotizacion, selectedSupermercado]);

  // ── Verificación de edad ──────────────────────────────────────────────────

  const handleConfirmarEdad = (mayor: boolean, fechaNac: string) => {
    setMostrarModalEdad(false);
    setEdadVerificada(true);
    setEsMayor(mayor);

    if (!mayor) {
      // Eliminar alcohol del carrito
      const sinAlcohol = seleccionados.filter(
        (s) => !(s.product.category === "bebestible" && esAlcohol(s.product.tipo))
      );
      setSeleccionados(sinAlcohol);
      toast.warning(
        "Como eres menor de edad, las bebidas alcohólicas fueron retiradas de tu selección.",
        { duration: 5000 }
      );
    } else {
      toast.success("Edad verificada. Puedes continuar con tu selección.");
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

    // Si hay alcohol, verificar edad
    if (tieneAlcohol(seleccionados)) {
      // Si el usuario tiene fecha de nacimiento guardada, usar esa
      if (currentUsuario?.fechaNacimiento) {
        const mayor = esMayorDeEdad(currentUsuario.fechaNacimiento);
        if (!mayor) {
          const sinAlcohol = seleccionados.filter(
            (s) => !(s.product.category === "bebestible" && esAlcohol(s.product.tipo))
          );
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

      // Si no está verificado aún, mostrar modal
      if (!edadVerificada) {
        setMostrarModalEdad(true);
        return;
      }
    }

    setStep("asador");
  };

  // ── Participantes ─────────────────────────────────────────────────────────

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
    if (participantes.length === 0) { toast.error("Debes agregar al menos un participante"); return false; }
    return true;
  };

  // ── Guardar evento ────────────────────────────────────────────────────────

  const handleGuardarEvento = (participantesConCostos: CostSplitParticipant[]) => {
    if (!currentUsuario || !cotizacionActiva) return;
    const eventoId = generateId();

    const evento = {
      id: eventoId,
      nombre: nombre.trim(),
      fecha,
      presupuesto: Math.round(participantesConCostos.reduce((sum, p) => sum + p.monto, 0)),
      estado: "planificado" as const,
      usuarioId: currentUsuario.id,
      participantes: participantesConCostos.map((p) => ({
        id: p.id,
        nombre: p.nombre,
        contactos: p.metodoContacto === "sin_notificacion"
          ? []
          : [{ id: generateId(), metodo: p.metodoContacto, valor: p.contacto }],
        metodoContacto: p.metodoContacto,
        contacto: p.contacto,
        monto: Math.round(p.monto),
        montoManual: p.montoManual,
        sinAlcohol: p.sinAlcohol,
        esOrganizador: p.esOrganizador,
      })),
      proteinas:   proteinas.map((item) => ({ ...item, id: generateId(), eventoId })),
      bebestibles: bebestibles.map((item) => ({ ...item, id: generateId(), eventoId })),
      ensaladas:   ensaladas.map((item) => ({ ...item, id: generateId(), eventoId })),
      insumos:     insumos.map((item) => ({ ...item, id: generateId(), eventoId })),
      caloriasTotales: Math.round(caloriasTotales),
      caloriasPorPersona: Math.round(caloriasPorPersona),
      cotizaciones,
      cotizacionSeleccionada: cotizacionActiva.supermercado,
      costoAsador: costoAsador,
      asador: asadorSeleccionado ? {
        id: asadorSeleccionado.id,
        nombre: asadorSeleccionado.nombre,
        telefono: asadorSeleccionado.telefono,
        correo: asadorSeleccionado.correo,
        tarifa: costoAsador,
      } : null,
      createdAt: new Date().toISOString(),
    };

    storage.saveEvento(evento);
    toast.success("Evento creado correctamente");
    navigate(`/event/${eventoId}`);
  };

  if (!currentUsuario) return null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {mostrarModalEdad && (
        <ModalVerificacionEdad onConfirmar={handleConfirmarEdad} />
      )}

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        {/* ── STEP: reparto ────────────────────────────────────── */}
        {step === "cost" && cotizacionActiva ? (
          <CostSplitStep
            participantes={participantes}
            total={cotizacionActiva.total}
            costoAlcoholTotal={cotizacionActiva.totalAlcohol}
            onBack={() => setStep("quote")}
            onConfirm={handleGuardarEvento}
          />

        /* ── STEP: cotización ────────────────────────────────── */
        ) : step === "quote" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cotización simulada</h1>
              <p className="mt-2 text-muted-foreground">
                Compara supermercados y elige la mejor opción para tu asado.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {cotizaciones.map((cotizacion, index) => {
                const esSeleccionada = cotizacion.supermercado === cotizacionActiva?.supermercado;
                const esMejor = index === 0;
                return (
                  <Card key={cotizacion.supermercado} className={esSeleccionada ? "border-primary shadow-sm" : ""}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle className="text-xl">{cotizacion.supermercado}</CardTitle>
                          <CardDescription>Simulación de canasta para este asado</CardDescription>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {esMejor && <Badge className="gap-1"><Trophy className="h-3.5 w-3.5" /> Más económico</Badge>}
                          {esSeleccionada && <Badge variant="outline">Seleccionado</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <p className="text-sm text-muted-foreground">Total supermercado</p>
                        <p className="text-3xl font-bold text-primary">{formatPrice(Math.round(cotizacion.total))}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Alcohol incluido: {formatPrice(Math.round(cotizacion.totalAlcohol))}
                        </p>
                      </div>
                      <div className="space-y-2 text-sm">
                        {cotizacion.detalles.slice(0, 5).map((detalle) => (
                          <div key={`${cotizacion.supermercado}-${detalle.nombre}`} className="flex items-center justify-between">
                            <span className="text-muted-foreground">{detalle.nombre}</span>
                            <span className="font-medium">{formatPrice(Math.round(detalle.subtotal))}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant={esSeleccionada ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setSelectedSupermercado(cotizacion.supermercado)}
                      >
                        {esSeleccionada ? "Cotización activa" : "Usar esta cotización"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Resumen de la cotización activa
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total elegido</p>
                  <p className="text-2xl font-bold">{formatPrice(Math.round(cotizacionActiva?.total || 0))}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Calorías totales</p>
                  <p className="text-2xl font-bold">{formatCalories(caloriasTotales)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Calorías por persona</p>
                  <p className="text-2xl font-bold">{formatCalories(caloriasPorPersona)}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setStep("config")}>Volver a la configuración</Button>
              <Button onClick={() => setStep("cost")}>Continuar a reparto de montos</Button>
            </div>
          </div>

        /* ── STEP: maestro asador ───────────────────────────── */
        ) : step === "asador" ? (
          <div className="space-y-6">
            <AsadorStep
              cantParticipantes={Math.max(participantes.length, 1)}
              asadorSeleccionado={asadorSeleccionado}
              onChange={setAsadorSeleccionado}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setStep("catalog")}>Volver al catálogo</Button>
              <Button onClick={() => setStep("config")}>Continuar a configuración</Button>
            </div>
          </div>

        /* ── STEP: configuración ─────────────────────────────── */
        ) : step === "config" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Configuración del evento</h1>
              <p className="mt-2 text-muted-foreground">Ponle nombre, fecha y agrega participantes.</p>
            </div>

            {/* Aviso si se eliminó el alcohol */}
            {edadVerificada && esMayor === false && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800">Alcohol restringido</p>
                  <p className="text-sm text-amber-700">
                    Las bebidas alcohólicas fueron retiradas de tu selección por ser menor de edad.
                  </p>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Productos seleccionados</CardTitle>
                <CardDescription>
                  {seleccionados.length} productos · {formatPrice(costoTotal)} estimado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {seleccionados.map((s) => (
                    <div key={s.product.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                      <span className="font-medium truncate flex-1 mr-2">{s.product.nombre}</span>
                      <span className="text-muted-foreground shrink-0">×{s.cantidad}</span>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3 text-muted-foreground" onClick={() => setStep("catalog")}>
                  Editar productos
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Datos del evento</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-evento">Nombre del evento</Label>
                    <Input id="nombre-evento" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha-evento">Fecha</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="fecha-evento" type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="pl-9" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Participantes</h3>
                      <p className="text-sm text-muted-foreground">El organizador siempre participa.</p>
                    </div>
                    <Badge variant="secondary">{participantes.length} asistentes</Badge>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={nuevoParticipante}
                      onChange={(e) => setNuevoParticipante(e.target.value)}
                      placeholder="Nombre del participante"
                      onKeyDown={(e) => e.key === "Enter" && handleAgregarParticipante()}
                    />
                    <Button type="button" onClick={handleAgregarParticipante}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar
                    </Button>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {participantes.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{p.nombre}</p>
                          <p className="text-sm text-muted-foreground">{p.esOrganizador ? "Organizador" : "Participante"}</p>
                        </div>
                        {!p.esOrganizador && (
                          <Button variant="ghost" size="icon" onClick={() => handleEliminarParticipante(p.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Costo productos</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">{formatPrice(costoTotal)}</p>
                  <p className="text-sm text-muted-foreground">Base antes de cotizar</p>
                </CardContent>
              </Card>
              {asadorSeleccionado && (
                <Card className="border-amber-200 bg-amber-50/30">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Maestro asador</CardTitle></CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-amber-700">{formatPrice(costoAsador)}</p>
                    <p className="text-sm text-muted-foreground">{asadorSeleccionado.nombre}</p>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Calorías totales</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCalories(caloriasTotales)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Calorías por persona</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCalories(caloriasPorPersona)}</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setStep("catalog")}>Volver al catálogo</Button>
              <Button onClick={() => { if (validarConfiguracion()) setStep("quote"); }}>
                Continuar a cotización
              </Button>
            </div>
          </div>

        /* ── STEP: catálogo ──────────────────────────────────── */
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crear evento</h1>
              <p className="mt-2 text-muted-foreground">
                Elige los productos para tu asado, luego configura el evento y reparte el costo.
              </p>
            </div>

            <ProductCatalogStep seleccionados={seleccionados} onChange={setSeleccionados} />

            <div className="flex justify-end">
              <Button size="lg" onClick={handleContinuarDesdeCatalogo}>
                Continuar a configuración
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}