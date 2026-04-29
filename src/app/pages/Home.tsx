import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import {
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Flame,
  CheckCircle2,
} from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo-basados.jpg" alt="Basados" className="h-11 w-11 rounded-lg object-cover" />
            <span className="text-xl font-semibold">BASADOS</span>
          </Link>

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link to="/create-event">Comenzar Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-600">
              <Flame className="h-4 w-4" />
              Planificación inteligente de asados
            </div>
            <h1 className="text-5xl font-bold tracking-tight">
              Organiza tus asados con cotización, calorías y reparto automático
            </h1>
            <p className="max-w-2xl text-xl text-muted-foreground">
              BASADOS centraliza participantes, insumos, comparación simulada entre supermercados y reparto de costos en una sola experiencia de demo.
            </p>
            <div className="flex gap-4 pt-4">
              <Button size="lg" asChild>
                <Link to="/register">
                  Crear Cuenta Gratis
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/price-comparison">
                  Ver Demo
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="rounded-[2rem] border bg-card p-6 shadow-xl">
              <img src="/logo-basados.jpg" alt="Logo BASADOS" className="w-full max-w-sm rounded-2xl object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Todo lo que necesitas en un solo lugar
          </h2>
          <p className="text-lg text-muted-foreground">
            Herramientas diseñadas para hacer tu vida más fácil
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Calendar className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Gestión de Eventos</CardTitle>
              <CardDescription>
                Crea y administra todos tus asados desde un solo lugar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Calendario integrado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Gestión de participantes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Estados del evento</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Cálculo Automático</CardTitle>
              <CardDescription>
                Calcula insumos, calorías y costo por persona automáticamente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Proteínas y bebestibles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Carbón y utensilios</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Calorías totales e individuales</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Comparador de Precios</CardTitle>
              <CardDescription>
                Cotiza entre supermercados y detecta la opción más económica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Múltiples supermercados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Mejor precio destacado</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Ahorro visible para la demo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Control de Participantes</CardTitle>
              <CardDescription>
                Gestiona quién asiste y cómo se reparte el costo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Lista de invitados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Información de contacto</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Costo por persona</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Flame className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Servicio de Asador</CardTitle>
              <CardDescription>
                Contrata asadores profesionales como extensión futura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Asadores calificados</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Calificaciones y reseñas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Reserva fácil</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="mb-2 h-10 w-10 text-primary" />
              <CardTitle>Reportes y Resúmenes</CardTitle>
              <CardDescription>
                Genera reportes completos de tus eventos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Resumen de costos</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Lista de compras</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> Historial de eventos</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 py-20">
        <Card className="border-orange-500/20 bg-gradient-to-r from-orange-500/10 via-background to-orange-500/10">
          <CardHeader className="space-y-4 pb-8 text-center">
            <CardTitle className="text-3xl">
              ¿Listo para organizar tu próximo asado?
            </CardTitle>
            <CardDescription className="mx-auto max-w-2xl text-base">
              Crea tu evento, revisa cotizaciones simuladas, controla calorías y reparte el costo sin hojas de cálculo eternas.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
            <Button size="lg" asChild>
              <Link to="/register">Empezar ahora</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t bg-muted/50">
        <div className="container mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-500 rounded-lg">
                  <span className="text-white text-lg">🔥</span>
                </div>
                <span className="font-semibold">BASADOS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Planificación inteligente para tus asados
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground transition">Inicio</Link></li>
                <li><Link to="/price-comparison" className="hover:text-foreground transition">Demo</Link></li>
                <li><Link to="/login" className="hover:text-foreground transition">Iniciar Sesión</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Ayuda</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contacto</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Privacidad</a></li>
                <li><a href="#" className="hover:text-foreground transition">Términos</a></li>
                <li><a href="#" className="hover:text-foreground transition">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 BASADOS. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition">Twitter</a>
              <a href="#" className="hover:text-foreground transition">Instagram</a>
              <a href="#" className="hover:text-foreground transition">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
