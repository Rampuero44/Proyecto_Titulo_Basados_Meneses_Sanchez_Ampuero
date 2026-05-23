import { useEffect } from "react";
import { useNavigate } from "react-router";
import { NavbarAdmin } from "../components/NavbarAdmin";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ExternalLink, BarChart2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const rol = user?.user_metadata?.rol ?? "usuario";

  useEffect(() => {
    if (loading) return;
    if (!user || rol !== "admin") {
      navigate("/dashboard");
    }
  }, [user, loading, rol, navigate]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <NavbarAdmin />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Panel de Administración</h1>
          <p className="mt-2 text-muted-foreground">
            Gestión y business intelligence del sistema Basados.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Dashboard de Supabase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Accede al dashboard de Supabase para consultar usuarios registrados,
                métricas de la base de datos y logs de autenticación.
              </p>
              <Button
                className="w-full"
                onClick={() => window.open("https://supabase.com/dashboard", "_blank")}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Abrir Supabase Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Business Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                El módulo de business intelligence está en desarrollo.
                Incluirá métricas de eventos, productos más cotizados y análisis de uso por comercio.
              </p>
              <p className="text-xs text-muted-foreground mt-3 italic">
                Próximamente disponible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
