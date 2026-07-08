import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Flame } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { calcularEdad } from "../utils/age";

interface Props {
  onAutenticado: () => void;
  onCancelar: () => void;
}

export function ModalAuthRequerido({ onAutenticado, onCancelar }: Props) {
  const { login, register } = useAuth();
  const [modo, setModo] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [cargando, setCargando] = useState(false);

  const fechaMaxima = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    setCargando(true);

    if (modo === "login") {
      const { error } = await login(email, password);
      if (error) {
        toast.error("Email o contraseña incorrectos");
        setCargando(false);
        return;
      }
    } else {
      if (!nombre.trim()) {
        toast.error("El nombre no puede estar vacío");
        setCargando(false);
        return;
      }
      if (!fechaNacimiento) {
        toast.error("Debes ingresar tu fecha de nacimiento");
        setCargando(false);
        return;
      }
      const edad = calcularEdad(fechaNacimiento);
      if (edad < 14) {
        toast.error("Debes tener al menos 14 años para registrarte");
        setCargando(false);
        return;
      }
      if (password.length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres");
        setCargando(false);
        return;
      }
      const { error } = await register(email, password, nombre.trim(), fechaNacimiento);
      if (error) {
        toast.error(error);
        setCargando(false);
        return;
      }
      toast.success("Cuenta creada. Tu asado ha sido guardado.");
    }

    setCargando(false);
    onAutenticado();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Flame className="h-7 w-7 text-primary" />
          </div>
          <CardTitle>Guarda tu asado</CardTitle>
          <CardDescription>
            Para compartir el reparto de costos necesitas una cuenta. Tu planificación se guardará automáticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex rounded-lg border overflow-hidden">
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${modo === "login" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => setModo("login")}
            >
              Iniciar sesión
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium transition-colors ${modo === "register" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => setModo("register")}
            >
              Crear cuenta
            </button>
          </div>

          {modo === "register" && (
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input placeholder="Juan Pérez" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </div>
          )}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          {modo === "register" && (
            <div className="space-y-2">
              <Label>Fecha de nacimiento</Label>
              <Input
                type="date"
                max={fechaMaxima}
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Contraseña</Label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={cargando}>
            {cargando ? "Procesando..." : modo === "login" ? "Ingresar y guardar asado" : "Crear cuenta y guardar asado"}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={onCancelar}>
            Cancelar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}