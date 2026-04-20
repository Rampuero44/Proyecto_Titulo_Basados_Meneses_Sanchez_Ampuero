import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ArrowLeft } from "lucide-react";
import { storage } from "../utils/localStorage";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar si es el usuario administrador
    if (email === "Admin" && password === "123Admin") {
      const adminUsuario = {
        id: 1,
        nombre: "Administrador",
        email: "Admin",
        password: "123Admin",
        rol: 'admin' as const,
      };
      storage.setCurrentUsuario(adminUsuario);
      toast.success("Bienvenido, Administrador!");
      navigate("/admin");
      return;
    }
    
    const usuario = storage.getUsuarioByEmail(email);
    
    if (!usuario) {
      toast.error("Usuario no encontrado");
      return;
    }

    const passwordValida = usuario.email === "juan@gmail.com"
      ? password === "juan123"
      : usuario.password === password;
    
    if (!passwordValida) {
      toast.error("Contraseña incorrecta");
      return;
    }
    
    storage.setCurrentUsuario(usuario);
    toast.success(`Bienvenido, ${usuario.nombre}!`);
    navigate("/dashboard");
  };

  return (
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
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
                <span className="text-white text-2xl">🔥</span>
              </div>
              <span className="text-2xl font-bold">BASADOS</span>
            </div>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Ingresa tu email y contraseña para acceder.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Usuario o Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
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
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
