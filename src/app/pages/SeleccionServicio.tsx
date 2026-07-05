import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Card, CardContent } from "../components/ui/card";
import { ChevronRight } from "lucide-react";

export function SeleccionServicio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight mb-3">¿Qué quieres hacer hoy?</h1>
          <p className="text-muted-foreground text-lg">
            Elige cómo quieres usar BASADOS
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">

          {/* Opción 1: Planificar asado completo */}
          <Card
            className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
            onClick={() => navigate("/create-event")}
          >
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="text-6xl">🔥</div>
              <div>
                <p className="text-xl font-bold group-hover:text-primary transition-colors">
                  Planificar un asado
                </p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Elige productos, compara precios en supermercados y reparte los costos entre los participantes.
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-primary font-medium">
                Comenzar <ChevronRight className="size-4" />
              </div>
            </CardContent>
          </Card>

          {/* Opción 2: Solo maestro asador */}
          <Card
            className="cursor-pointer hover:border-primary hover:shadow-lg transition-all group"
            onClick={() => navigate("/contratar-asador")}
          >
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="text-6xl">👨‍🍳</div>
              <div>
                <p className="text-xl font-bold group-hover:text-primary transition-colors">
                  Contratar un maestro asador
                </p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Encuentra un profesional que se encargue de todo el asado por ti.
                </p>
              </div>
              <div className="flex items-center justify-center gap-1 text-sm text-primary font-medium">
                Ver asadores <ChevronRight className="size-4" />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}