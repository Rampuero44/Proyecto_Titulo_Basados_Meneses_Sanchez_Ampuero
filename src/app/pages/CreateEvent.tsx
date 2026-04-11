import { useEffect, useMemo, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, Beef, Beer, Calendar, Flame, Plus, Salad, ShoppingCart, Trophy, X } from "lucide-react";
import { storage, generateId, Participante } from "../utils/localStorage";
import { calcularInsumos, generarCotizacionesSimuladas } from "../utils/calculator";
import { toast } from "sonner";
import { CostSplitParticipant, CostSplitStep } from "../components/CostSplitStep";

type ItemTemplate = {
  key: string;
  nombre: string;
  tipo: string;
  porPrecio: number;
  calorias: number;
};

const PROTEINAS_BASE: ItemTemplate[] = [
  { key: "lomo-vetado", nombre: "Lomo Vetado (kg)", tipo: "carne", porPrecio: 8000, calorias: 2500 },
  { key: "pollo", nombre: "Pollo (kg)", tipo: "pollo", porPrecio: 3500, calorias: 1900 },
  { key: "chorizo", nombre: "Chorizo", tipo: "chorizo", porPrecio: 800, calorias: 280 },
];

const BEBESTIBLES_BASE: ItemTemplate[] = [
  { key: "cerveza", nombre: "Cerveza (pack 6)", tipo: "cerveza", porPrecio: 6000, calorias: 900 },
  { key: "gaseosa", nombre: "Gaseosa 2L", tipo: "gaseosa", porPrecio: 2500, calorias: 840 },
  { key: "agua", nombre: "Agua mineral 2L", tipo: "agua", porPrecio: 1500, calorias: 0 },
];

const ENSALADAS_BASE: ItemTemplate[] = [
  { key: "mixta", nombre: "Ensalada mixta", tipo: "mixta", porPrecio: 4000, calorias: 250 },
  { key: "tomate", nombre: "Tomate (kg)", tipo: "tomate", porPrecio: 2000, calorias: 180 },
];

const INSUMOS_BASE: ItemTemplate[] = [
  { key: "carbon", nombre: "Carbón", tipo: "carbon", porPrecio: 5000, calorias: 0 },
  { key: "pan", nombre: "Pan (bolsa 10)", tipo: "pan", porPrecio: 2000, calorias: 2650 },
  { key: "chimichurri", nombre: "Chimichurri", tipo: "condimento", porPrecio: 3000, calorias: 180 },
];

const formatDateForInput = (date: Date) => {
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return offsetDate.toISOString().split("T")[0];
};

const findTemplateByName = (templates: ItemTemplate[], nombre: string) =>
  templates.find((item) => item.nombre === nombre);

const formatCalories = (value: number) => `${Math.round(value).toLocaleString()} kcal`;

export function CreateEvent() {
  const navigate = useNavigate();
  const [currentUsuario] = useState(() => storage.getCurrentUsuario() || storage.getUsuarioByEmail("juan@gmail.com") || null);
  const [step, setStep] = useState<"config" | "quote" | "cost">("config");

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState(formatDateForInput(new Date()));
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [nuevoParticipante, setNuevoParticipante] = useState("");

  const [selectedProteinas, setSelectedProteinas] = useState<string[]>(PROTEINAS_BASE.map((item) => item.key));
  const [selectedBebestibles, setSelectedBebestibles] = useState<string[]>(BEBESTIBLES_BASE.map((item) => item.key));
  const [selectedEnsaladas, setSelectedEnsaladas] = useState<string[]>(ENSALADAS_BASE.map((item) => item.key));
  const [selectedInsumos, setSelectedInsumos] = useState<string[]>(INSUMOS_BASE.map((item) => item.key));
  const [selectedSupermercado, setSelectedSupermercado] = useState<string>("");

  useEffect(() => {
    if (!currentUsuario) {
      navigate("/login");
      return;
    }

    if (!storage.getCurrentUsuario()) {
      storage.setCurrentUsuario(currentUsuario);
    }

    const nombreSugerido = `Evento de ${currentUsuario.nombre}`;
    setNombre((prev) => prev || nombreSugerido);

    setParticipantes((prev) => {
      const existeUsuario = prev.some(
        (participante) => participante.nombre.trim().toLowerCase() === currentUsuario.nombre.trim().toLowerCase(),
      );

      if (existeUsuario) return prev;

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

  const resumenBase = useMemo(() => {
    const calculoBase = calcularInsumos(0, participantes.length || 1);

    const proteinas = calculoBase.proteinas.filter((item) => {
      const template = findTemplateByName(PROTEINAS_BASE, item.nombre);
      return template ? selectedProteinas.includes(template.key) : false;
    });

    const bebestibles = calculoBase.bebestibles.filter((item) => {
      const template = findTemplateByName(BEBESTIBLES_BASE, item.nombre);
      return template ? selectedBebestibles.includes(template.key) : false;
    });

    const ensaladas = calculoBase.ensaladas.filter((item) => {
      const template = findTemplateByName(ENSALADAS_BASE, item.nombre);
      return template ? selectedEnsaladas.includes(template.key) : false;
    });

    const insumos = calculoBase.insumos.filter((item) => {
      const template = findTemplateByName(INSUMOS_BASE, item.nombre);
      return template ? selectedInsumos.includes(template.key) : false;
    });

    const costoTotal = [...proteinas, ...bebestibles, ...ensaladas, ...insumos].reduce(
      (sum, item) => sum + item.cantidad * item.porPrecio,
      0,
    );

    const costoAlcoholTotal = bebestibles
      .filter((item) => item.tipo === "cerveza")
      .reduce((sum, item) => sum + item.cantidad * item.porPrecio, 0);

    const caloriasTotales = [...proteinas, ...bebestibles, ...ensaladas, ...insumos]
      .reduce((sum, item) => sum + item.cantidad * (item.calorias || 0), 0);

    return {
      proteinas,
      bebestibles,
      ensaladas,
      insumos,
      costoTotal,
      costoAlcoholTotal,
      costoPorPersona: participantes.length > 0 ? costoTotal / participantes.length : 0,
      caloriasTotales,
      caloriasPorPersona: participantes.length > 0 ? caloriasTotales / participantes.length : 0,
    };
  }, [participantes.length, selectedProteinas, selectedBebestibles, selectedEnsaladas, selectedInsumos]);

  const cotizaciones = useMemo(
    () => generarCotizacionesSimuladas(resumenBase.proteinas, resumenBase.bebestibles, resumenBase.ensaladas, resumenBase.insumos),
    [resumenBase],
  );

  const mejorCotizacion = cotizaciones[0] || null;
  const cotizacionActiva = cotizaciones.find((item) => item.supermercado === selectedSupermercado) || mejorCotizacion;

  useEffect(() => {
    if (mejorCotizacion && !selectedSupermercado) {
      setSelectedSupermercado(mejorCotizacion.supermercado);
    }
  }, [mejorCotizacion, selectedSupermercado]);

  const toggleSelection = (key: string, values: string[], setter: Dispatch<SetStateAction<string[]>>) => {
    setter(values.includes(key) ? values.filter((value) => value !== key) : [...values, key]);
  };

  const handleAgregarParticipante = () => {
    const nombreParticipante = nuevoParticipante.trim();

    if (!nombreParticipante) {
      toast.error("Ingresa un nombre para el participante");
      return;
    }

    const yaExiste = participantes.some(
      (participante) => participante.nombre.trim().toLowerCase() === nombreParticipante.toLowerCase(),
    );

    if (yaExiste) {
      toast.error("Ese participante ya fue agregado");
      return;
    }

    setParticipantes((prev) => [
      ...prev,
      {
        id: generateId(),
        nombre: nombreParticipante,
        contactos: [],
        metodoContacto: "sin_notificacion",
        contacto: "",
        esOrganizador: false,
      },
    ]);
    setNuevoParticipante("");
    toast.success("Participante agregado");
  };

  const handleEliminarParticipante = (participanteId: number) => {
    const participante = participantes.find((item) => item.id === participanteId);

    if (participante?.esOrganizador) {
      toast.error("El organizador siempre participa en el evento");
      return;
    }

    setParticipantes((prev) => prev.filter((item) => item.id !== participanteId));
  };

  const validarConfiguracion = () => {
    if (!nombre.trim()) {
      toast.error("Debes ingresar un nombre para el evento");
      return false;
    }

    if (!fecha) {
      toast.error("Debes seleccionar una fecha");
      return false;
    }

    if (participantes.length === 0) {
      toast.error("Debes agregar al menos un participante");
      return false;
    }

    if (
      selectedProteinas.length === 0 &&
      selectedBebestibles.length === 0 &&
      selectedEnsaladas.length === 0 &&
      selectedInsumos.length === 0
    ) {
      toast.error("Selecciona al menos un ítem para el asado");
      return false;
    }

    return true;
  };

  const handleIrACotizacion = () => {
    if (!validarConfiguracion()) return;
    setStep("quote");
  };

  const handleGuardarEvento = (participantesConCostos: CostSplitParticipant[]) => {
    if (!currentUsuario || !cotizacionActiva) return;

    const eventoId = generateId();

    const proteinas = resumenBase.proteinas.map((item) => ({ ...item, id: generateId(), eventoId }));
    const bebestibles = resumenBase.bebestibles.map((item) => ({ ...item, id: generateId(), eventoId }));
    const ensaladas = resumenBase.ensaladas.map((item) => ({ ...item, id: generateId(), eventoId }));
    const insumos = resumenBase.insumos.map((item) => ({ ...item, id: generateId(), eventoId }));

    const evento = {
      id: eventoId,
      nombre: nombre.trim(),
      fecha,
      presupuesto: Math.round(participantesConCostos.reduce((sum, participante) => sum + participante.monto, 0)),
      estado: "planificado" as const,
      usuarioId: currentUsuario.id,
      participantes: participantesConCostos.map((participante) => ({
        id: participante.id,
        nombre: participante.nombre,
        contactos: participante.metodoContacto === "sin_notificacion"
          ? []
          : [{ id: generateId(), metodo: participante.metodoContacto, valor: participante.contacto }],
        metodoContacto: participante.metodoContacto,
        contacto: participante.contacto,
        monto: Math.round(participante.monto),
        montoManual: participante.montoManual,
        sinAlcohol: participante.sinAlcohol,
        esOrganizador: participante.esOrganizador,
      })),
      proteinas,
      bebestibles,
      insumos,
      ensaladas,
      caloriasTotales: Math.round(resumenBase.caloriasTotales),
      caloriasPorPersona: Math.round(resumenBase.caloriasPorPersona),
      cotizaciones,
      cotizacionSeleccionada: cotizacionActiva.supermercado,
      createdAt: new Date().toISOString(),
    };

    storage.saveEvento(evento);
    toast.success("Evento creado correctamente");
    navigate(`/event/${eventoId}`);
  };

  const renderSelectionList = (
    title: string,
    description: string,
    icon: ReactNode,
    items: ItemTemplate[],
    selected: string[],
    setter: Dispatch<SetStateAction<string[]>>,
  ) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selected.includes(item.key)}
                onCheckedChange={() => toggleSelection(item.key, selected, setter)}
                id={`${title}-${item.key}`}
              />
              <div>
                <Label htmlFor={`${title}-${item.key}`} className="cursor-pointer font-medium">
                  {item.nombre}
                </Label>
                <p className="text-sm text-muted-foreground">
                  ${item.porPrecio.toLocaleString()} base · {item.calorias > 0 ? `${item.calorias.toLocaleString()} kcal` : "0 kcal"}
                </p>
              </div>
            </div>
            {selected.includes(item.key) && <Badge>Incluido</Badge>}
          </div>
        ))}
      </CardContent>
    </Card>
  );

  if (!currentUsuario) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Button>

        {step === "cost" && cotizacionActiva ? (
          <CostSplitStep
            participantes={participantes}
            total={cotizacionActiva.total}
            costoAlcoholTotal={cotizacionActiva.totalAlcohol}
            onBack={() => setStep("quote")}
            onConfirm={handleGuardarEvento}
          />
        ) : step === "quote" ? (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cotización simulada</h1>
              <p className="mt-2 text-muted-foreground">
                Compara supermercados para los productos seleccionados y usa la opción más económica como base del reparto.
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
                        <p className="text-3xl font-bold text-primary">${Math.round(cotizacion.total).toLocaleString()}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Alcohol incluido: ${Math.round(cotizacion.totalAlcohol).toLocaleString()}</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        {cotizacion.detalles.slice(0, 5).map((detalle) => (
                          <div key={`${cotizacion.supermercado}-${detalle.nombre}`} className="flex items-center justify-between">
                            <span className="text-muted-foreground">{detalle.nombre}</span>
                            <span className="font-medium">${Math.round(detalle.subtotal).toLocaleString()}</span>
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
                <CardDescription>
                  Actualmente usarás {cotizacionActiva?.supermercado}. Puedes cambiarlo antes de pasar al reparto.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Total elegido</p>
                  <p className="text-2xl font-bold">${Math.round(cotizacionActiva?.total || 0).toLocaleString()}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Calorías totales estimadas</p>
                  <p className="text-2xl font-bold">{formatCalories(resumenBase.caloriasTotales)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Calorías por participante</p>
                  <p className="text-2xl font-bold">{formatCalories(resumenBase.caloriasPorPersona)}</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setStep("config")}>Volver a la configuración</Button>
              <Button onClick={() => setStep("cost")}>Continuar a reparto de montos</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Crear evento</h1>
              <p className="mt-2 text-muted-foreground">
                Selecciona productos, revisa calorías simuladas y prepara el asado antes de repartir el costo.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {renderSelectionList(
                "Proteínas",
                "Selecciona las proteínas que quieres incluir en el asado.",
                <Beef className="h-5 w-5" />,
                PROTEINAS_BASE,
                selectedProteinas,
                setSelectedProteinas,
              )}

              {renderSelectionList(
                "Bebestibles",
                "Incluye bebidas alcohólicas y sin alcohol.",
                <Beer className="h-5 w-5" />,
                BEBESTIBLES_BASE,
                selectedBebestibles,
                setSelectedBebestibles,
              )}

              {renderSelectionList(
                "Ensaladas",
                "Acompañamientos frescos para equilibrar el menú.",
                <Salad className="h-5 w-5" />,
                ENSALADAS_BASE,
                selectedEnsaladas,
                setSelectedEnsaladas,
              )}

              {renderSelectionList(
                "Insumos",
                "Pan, carbón y extras básicos para el evento.",
                <Flame className="h-5 w-5" />,
                INSUMOS_BASE,
                selectedInsumos,
                setSelectedInsumos,
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Configuración del evento</CardTitle>
                <CardDescription>Debajo de la selección puedes ajustar nombre, fecha y participantes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-evento">Nombre del evento</Label>
                    <Input id="nombre-evento" value={nombre} onChange={(event) => setNombre(event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fecha-evento">Fecha</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fecha-evento"
                        type="date"
                        value={fecha}
                        onChange={(event) => setFecha(event.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Participantes</h3>
                      <p className="text-sm text-muted-foreground">El usuario organizador siempre participa.</p>
                    </div>
                    <Badge variant="secondary">{participantes.length} asistentes</Badge>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      value={nuevoParticipante}
                      onChange={(event) => setNuevoParticipante(event.target.value)}
                      placeholder="Nombre del participante"
                    />
                    <Button type="button" onClick={handleAgregarParticipante}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar participante
                    </Button>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {participantes.map((participante) => (
                      <div key={participante.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{participante.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {participante.esOrganizador ? "Organizador" : "Participante"}
                          </p>
                        </div>
                        {!participante.esOrganizador && (
                          <Button variant="ghost" size="icon" onClick={() => handleEliminarParticipante(participante.id)}>
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
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Costo estimado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-primary">${Math.round(resumenBase.costoTotal).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Base simulada antes de cotizar</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Calorías totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCalories(resumenBase.caloriasTotales)}</p>
                  <p className="text-sm text-muted-foreground">Suma estimada de los productos elegidos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Calorías por persona</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatCalories(resumenBase.caloriasPorPersona)}</p>
                  <p className="text-sm text-muted-foreground">Promedio individual según asistentes</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleIrACotizacion}>Continuar a cotización</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
