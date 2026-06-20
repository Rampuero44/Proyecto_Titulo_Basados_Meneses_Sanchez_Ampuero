import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Wine } from "lucide-react";
import { esMayorDeEdad } from "../utils/age";

interface ModalEdadProps {
  onConfirmar: (esMayor: boolean, fechaNacimiento: string) => void;
}

export function ModalVerificacionEdad({ onConfirmar }: ModalEdadProps) {
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
