import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Flame } from "lucide-react";

export interface ContextoEvento {
  asistentes: number;
  tipoAsado: string;
  presupuesto: number;
}

const TIPOS_ASADO = ["Familiar", "Celebración", "Íntimo", "Corporativo"];

interface Props {
  onConfirmar: (contexto: ContextoEvento) => void;
}

export function ModalContextoEvento({ onConfirmar }: Props) {
  const [asistentes, setAsistentes] = useState("");
  const [tipoAsado, setTipoAsado] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [errorAsistentes, setErrorAsistentes] = useState("");

  const handleConfirmar = () => {
    if (!asistentes || Number(asistentes) < 1) {
      setErrorAsistentes("Ingresa al menos 1 asistente para continuar");
      return;
    }
    onConfirmar({
      asistentes: Number(asistentes),
      tipoAsado: tipoAsado || "General",
      presupuesto: Number(presupuesto) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Flame className="h-7 w-7 text-primary" />
          </div>
          <CardTitle>Cuéntanos sobre tu asado</CardTitle>
          <CardDescription>
            Con esta información la IA te ayudará a calcular porciones y encontrar la mejor cotización.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">

          <div className="space-y-2">
            <Label className="text-base font-semibold">
              ¿Cuántas personas asistirán?
              <span className="ml-1 text-primary">*</span>
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="Ej: 10"
              className="text-lg h-12"
              value={asistentes}
              onChange={(e) => { setAsistentes(e.target.value); setErrorAsistentes(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
              autoFocus
            />
            {errorAsistentes && <p className="text-xs text-destructive">{errorAsistentes}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Tipo de asado <span className="italic">(opcional)</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TIPOS_ASADO.map((tipo) => (
                <button
                  key={tipo}
                  onClick={() => setTipoAsado(tipoAsado === tipo ? "" : tipo)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                    tipoAsado === tipo
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Presupuesto aproximado en CLP <span className="italic">(opcional)</span>
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-sm text-muted-foreground">$</span>
              <Input
                type="number"
                min={0}
                placeholder="Ej: 80000"
                className="pl-7"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirmar()}
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleConfirmar}>
            Comenzar a planificar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
