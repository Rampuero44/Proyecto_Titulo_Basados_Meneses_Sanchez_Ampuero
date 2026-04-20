import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { DollarSign, Mail, Phone, Undo2, Send } from "lucide-react";
import { Participante } from "../utils/localStorage";
import { toast } from "sonner";

export type MetodoNotificacion = "sin_notificacion" | "correo" | "telefono";

export interface CostSplitParticipant extends Participante {
  metodoContacto: MetodoNotificacion;
  contacto: string;
  monto: number;
  montoManual: boolean;
  sinAlcohol: boolean;
  esOrganizador?: boolean;
}

interface CostSplitStepProps {
  participantes: Participante[];
  total: number;
  costoAlcoholTotal: number;
  onBack: () => void;
  onConfirm: (participantes: CostSplitParticipant[]) => void;
}

const roundMoney = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const normalizeMontos = (rows: CostSplitParticipant[], targetTotal: number) => {
  const sum = rows.reduce((acc, row) => acc + row.monto, 0);
  const diff = roundMoney(targetTotal - sum);

  if (Math.abs(diff) < 0.01 || rows.length === 0) {
    return rows;
  }

  const candidateIndex = rows.findIndex((row) => !row.montoManual) !== -1
    ? rows.findIndex((row) => !row.montoManual)
    : rows.length - 1;

  const next = rows.map((row) => ({ ...row }));
  next[candidateIndex].monto = roundMoney(next[candidateIndex].monto + diff);
  return next;
};

const buildDistribution = (
  source: CostSplitParticipant[],
  total: number,
  alcoholTotal: number,
): CostSplitParticipant[] => {
  const safeTotal = roundMoney(total);
  const nonAlcoholTotal = roundMoney(Math.max(safeTotal - alcoholTotal, 0));
  const allowedAlcoholCount = source.filter((row) => !row.sinAlcohol).length;
  const basePerPerson = source.length > 0 ? nonAlcoholTotal / source.length : 0;
  const alcoholPerAllowed = allowedAlcoholCount > 0 ? alcoholTotal / allowedAlcoholCount : 0;

  const baselineMap = new Map<number, number>();
  source.forEach((row) => {
    const base = basePerPerson + (row.sinAlcohol ? 0 : alcoholPerAllowed);
    baselineMap.set(row.id, base);
  });

  const manualRows = source.filter((row) => row.montoManual);
  const autoRows = source.filter((row) => !row.montoManual);
  const totalManual = manualRows.reduce((acc, row) => acc + Number(row.monto || 0), 0);
  const remaining = roundMoney(safeTotal - totalManual);

  const next = source.map((row) => ({ ...row }));

  if (autoRows.length > 0) {
    const baselineAutoSum = autoRows.reduce((acc, row) => acc + (baselineMap.get(row.id) || 0), 0);

    next.forEach((row) => {
      if (row.montoManual) {
        row.monto = roundMoney(Number(row.monto || 0));
        return;
      }

      const weight = baselineMap.get(row.id) || 0;
      const proportional = baselineAutoSum > 0 ? (remaining * weight) / baselineAutoSum : remaining / autoRows.length;
      row.monto = roundMoney(proportional);
    });

    return normalizeMontos(next, safeTotal);
  }

  next.forEach((row) => {
    row.monto = roundMoney(Number(row.monto || 0));
  });

  return next;
};

const makeInitialRows = (participantes: Participante[], total: number, alcoholTotal: number): CostSplitParticipant[] => {
  const initial = participantes.map((participante) => ({
    ...participante,
    metodoContacto: (participante.metodoContacto as MetodoNotificacion) || "sin_notificacion",
    contacto: participante.contacto || participante.contactos?.[0]?.valor || "",
    monto: typeof participante.monto === "number" ? participante.monto : 0,
    montoManual: participante.montoManual || false,
    sinAlcohol: participante.sinAlcohol || false,
    esOrganizador: participante.esOrganizador || false,
  }));

  return buildDistribution(initial, total, alcoholTotal);
};

export function CostSplitStep({ participantes, total, costoAlcoholTotal, onBack, onConfirm }: CostSplitStepProps) {
  const [rows, setRows] = useState<CostSplitParticipant[]>(() => makeInitialRows(participantes, total, costoAlcoholTotal));

  useEffect(() => {
    setRows(makeInitialRows(participantes, total, costoAlcoholTotal));
  }, [participantes, total, costoAlcoholTotal]);

  const roundedTotal = useMemo(() => roundMoney(total), [total]);
  const currentTotal = useMemo(() => roundMoney(rows.reduce((acc, row) => acc + row.monto, 0)), [rows]);
  const diferencia = useMemo(() => roundMoney(roundedTotal - currentTotal), [roundedTotal, currentTotal]);
  const todosManuales = rows.length > 0 && rows.every((row) => row.montoManual);

  const updateRows = (updater: (prev: CostSplitParticipant[]) => CostSplitParticipant[]) => {
    setRows((prev) => {
      const updated = updater(prev).map((row) => ({ ...row }));
      return buildDistribution(updated, roundedTotal, costoAlcoholTotal);
    });
  };

  const handleMontoChange = (id: number, value: string) => {
    const parsed = Number(value);
    updateRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              monto: Number.isFinite(parsed) ? Math.max(parsed, 0) : 0,
              montoManual: true,
            }
          : row,
      ),
    );
  };

  const handleSinAlcohol = (id: number, checked: boolean) => {
    updateRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              sinAlcohol: checked,
            }
          : row,
      ),
    );
  };

  const handleMetodo = (id: number, metodo: MetodoNotificacion) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              metodoContacto: metodo,
              contacto: metodo === "sin_notificacion" ? "" : row.contacto,
            }
          : row,
      ),
    );
  };

  const handleContacto = (id: number, contacto: string) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              contacto,
            }
          : row,
      ),
    );
  };

  const resetMonto = (id: number) => {
    updateRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              montoManual: false,
            }
          : row,
      ),
    );
  };

  const handleFinalizar = () => {
    if (todosManuales && Math.abs(diferencia) >= 0.01) {
      toast.error("Los montos manuales no cuadran con el total del asado");
      return;
    }

    const hayDatosInvalidos = rows.some(
      (row) => row.metodoContacto !== "sin_notificacion" && !row.contacto.trim(),
    );

    if (hayDatosInvalidos) {
      toast.error("Completa el contacto de quienes recibirán notificación");
      return;
    }

    const confirmar = window.confirm("¿Estás seguro de enviar las notificaciones de costo a los participantes?");
    if (!confirmar) {
      return;
    }

    toast.success("Notificaciones enviadas correctamente (simulación)");
    onConfirm(rows.map((row) => ({ ...row, monto: roundMoney(row.monto) })));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Repartición de costos</h2>
          <p className="text-muted-foreground">
            Ajusta cuánto paga cada participante y cómo se notificará.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">Total: ${roundedTotal.toLocaleString()}</Badge>
          <Badge variant="outline">Alcohol: ${roundMoney(costoAlcoholTotal).toLocaleString()}</Badge>
        </div>
      </div>

      {todosManuales && Math.abs(diferencia) >= 0.01 && (
        <Alert>
          <AlertDescription>
            Todos los participantes quedaron con monto manual. Ajusta los montos para que sumen exactamente ${roundedTotal.toLocaleString()}.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4">
        {rows.map((row, index) => (
          <Card key={row.id}>
            <CardHeader>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-lg">{index + 1}. {row.nombre}</CardTitle>
                  <CardDescription>
                    {row.esOrganizador ? "Organizador del evento" : "Participante"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {row.montoManual && <Badge>Manual</Badge>}
                  {row.sinAlcohol && <Badge variant="outline">Sin alcohol</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor={`monto-${row.id}`}>Monto a pagar</Label>
                <div className="flex gap-2">
                  <Input
                    id={`monto-${row.id}`}
                    type="number"
                    min="0"
                    step="100"
                    value={row.monto}
                    onChange={(event) => handleMontoChange(row.id, event.target.value)}
                  />
                  {row.montoManual && (
                    <Button type="button" variant="outline" size="icon" onClick={() => resetMonto(row.id)} title="Volver a monto automático">
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Método de contacto</Label>
                <Select value={row.metodoContacto} onValueChange={(value: MetodoNotificacion) => handleMetodo(row.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin_notificacion">Sin notificación</SelectItem>
                    <SelectItem value="correo">Correo</SelectItem>
                    <SelectItem value="telefono">Teléfono</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`contacto-${row.id}`}>Contacto</Label>
                <Input
                  id={`contacto-${row.id}`}
                  value={row.contacto}
                  disabled={row.metodoContacto === "sin_notificacion"}
                  placeholder={row.metodoContacto === "telefono" ? "+56 9 1234 5678" : "correo@ejemplo.com"}
                  onChange={(event) => handleContacto(row.id, event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="block">Preferencias</Label>
                <div className="flex items-center gap-3 rounded-md border p-3">
                  <Checkbox
                    id={`sin-alcohol-${row.id}`}
                    checked={row.sinAlcohol}
                    onCheckedChange={(checked) => handleSinAlcohol(row.id, checked === true)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor={`sin-alcohol-${row.id}`} className="cursor-pointer">Sin alcohol</Label>
                    <p className="text-xs text-muted-foreground">No se le asigna costo de bebidas alcohólicas.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Monto total repartido</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              {currentTotal.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Diferencia actual: ${diferencia.toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={onBack}>
              Volver a la configuración
            </Button>
            <Button type="button" onClick={handleFinalizar}>
              <Send className="mr-2 h-4 w-4" />
              Finalizar y simular envío
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resumen rápido de notificaciones</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((row) => (
            <div key={`summary-${row.id}`} className="rounded-lg border p-3 text-sm">
              <p className="font-semibold">{row.nombre}</p>
              <p className="text-muted-foreground">
                {row.metodoContacto === "correo" && <Mail className="inline h-3.5 w-3.5 mr-1" />}
                {row.metodoContacto === "telefono" && <Phone className="inline h-3.5 w-3.5 mr-1" />}
                {row.metodoContacto === "sin_notificacion" ? "Sin notificación" : row.contacto || "Pendiente"}
              </p>
              <p className="mt-1">Monto: <span className="font-medium">${row.monto.toLocaleString()}</span></p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
