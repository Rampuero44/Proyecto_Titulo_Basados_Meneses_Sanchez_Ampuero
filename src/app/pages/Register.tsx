import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { storage, generateId, esMayorDeEdad } from "../utils/localStorage";
import { toast } from "sonner";

export function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (!fechaNacimiento) {
      toast.error("Debes ingresar tu fecha de nacimiento");
      return;
    }

    const existingUsuario = storage.getUsuarioByEmail(email);
    if (existingUsuario) {
      toast.error("Este email ya está registrado");
      return;
    }

    const newUsuario = {
      id: generateId(),
      nombre,
      email,
      password,
      rol: 'usuario' as const,
      fechaNacimiento,
    };

    storage.saveUsuario(newUsuario);
    storage.setCurrentUsuario(newUsuario);

    if (!esMayorDeEdad(fechaNacimiento)) {
      toast.success("Registro exitoso. Nota: el alcohol estará restringido en tus eventos.");
    } else {
      toast.success("Registro exitoso!");
    }

    navigate("/dashboard");
  };

  // Calcular fecha máxima (hoy) para el input de fecha
  const fechaMaxima = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/50">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="w-fit -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Button>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center gap-2 mb-4">
                <img
                  src="/logo-basados.jpg"
                  alt="BASADOS"
                  className="w-16 h-16 rounded-xl object-cover"
                />
              </div>
              <CardTitle>Crear Cuenta</CardTitle>
              <CardDescription>
                Completa tus datos para registrarte
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Juan Pérez"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                <Input
                  id="fechaNacimiento"
                  type="date"
                  max={fechaMaxima}
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Necesaria para verificar acceso a contenido con alcohol
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Registrarse
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}