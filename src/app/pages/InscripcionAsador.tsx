import { useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { ChefHat, MapPin, Phone, Mail, Star, Clock, Globe, Instagram, Facebook } from "lucide-react";
import { apiFetch } from "../utils/apiClient";

const API_URL = `${import.meta.env.VITE_API_URL}/api/maestros-parrilleros/inscripcion`;

interface FormData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  descripcion: string;
  experienciaAnos: string;
  valorServicio: string;
  ciudad: string;
  comuna: string;
  instagram: string;
  facebook: string;
  sitioWeb: string;
}

const initialForm: FormData = {
  nombre: "", apellido: "", correo: "", telefono: "",
  descripcion: "", experienciaAnos: "", valorServicio: "",
  ciudad: "", comuna: "", instagram: "", facebook: "", sitioWeb: "",
};

export function InscripcionAsador() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormData>(initialForm);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.correo || !form.telefono ||
        !form.descripcion || !form.experienciaAnos || !form.valorServicio) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }

    setEnviando(true);
    try {
      const response = await apiFetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          correo: form.correo,
          telefono: form.telefono,
          descripcion: form.descripcion,
          experienciaAnos: parseInt(form.experienciaAnos),
          valorServicio: parseFloat(form.valorServicio),
          ciudad: form.ciudad,
          comuna: form.comuna,
          instagram: form.instagram,
          facebook: form.facebook,
          sitioWeb: form.sitioWeb,
        }),
      });

      if (!response.ok) {
        const msg = await response.text();
        throw new Error(msg || "Error al enviar la solicitud");
      }

      setEnviado(true);
      toast.success("¡Solicitud enviada! Te contactaremos pronto.");
    } catch (err: any) {
      toast.error(err.message ?? "No se pudo enviar la solicitud. Intenta nuevamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-lg px-4 py-20 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <ChefHat className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold">¡Solicitud enviada!</h1>
          <p className="mb-2 text-muted-foreground">
            Recibimos tu solicitud para unirte como Maestro Asador en BASADOS.
          </p>
          <p className="mb-8 text-muted-foreground">
            Nuestro equipo revisará tu perfil y te contactará al correo <strong>{form.correo}</strong> en los próximos días hábiles.
          </p>
          <Button onClick={() => navigate("/")}>Volver al inicio</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-2xl px-4 py-10">

        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <img src="/logo-basados.jpg" alt="BASADOS" className="w-16 h-16 rounded-xl object-cover" />
          </div>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <ChefHat className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Inscríbete como Maestro Asador</h1>
          <p className="mt-2 text-muted-foreground">
            Completa el formulario y nuestro equipo revisará tu solicitud. Los campos marcados con * son obligatorios.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Datos personales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Mail className="h-4 w-4" /> Datos personales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nombre *</label>
                  <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Apellido *</label>
                  <Input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tu apellido" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Correo electrónico *</label>
                <Input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="tucorreo@email.com" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-1"><Phone className="h-3 w-3" /> Teléfono *</label>
                <Input name="telefono" value={form.telefono} onChange={handleChange} placeholder="+56 9 1234 5678" />
              </div>
            </CardContent>
          </Card>

          {/* Experiencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Star className="h-4 w-4" /> Experiencia y tarifa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Descripción de tu experiencia *</label>
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  placeholder="Cuéntanos sobre tu experiencia como maestro asador, especialidades, tipo de eventos que manejas..."
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium flex items-center gap-1"><Clock className="h-3 w-3" /> Años de experiencia *</label>
                  <Input name="experienciaAnos" type="number" min="0" value={form.experienciaAnos} onChange={handleChange} placeholder="Ej: 5" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Tarifa por servicio (CLP) *</label>
                  <Input name="valorServicio" type="number" min="0" value={form.valorServicio} onChange={handleChange} placeholder="Ej: 80000" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zona de cobertura */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4" /> Zona de cobertura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Ciudad</label>
                  <Input name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Ej: Santiago" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Comuna</label>
                  <Input name="comuna" value={form.comuna} onChange={handleChange} placeholder="Ej: Las Condes" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Redes sociales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Globe className="h-4 w-4" /> Redes sociales y sitio web
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-1"><Instagram className="h-3 w-3" /> Instagram</label>
                <Input name="instagram" value={form.instagram} onChange={handleChange} placeholder="@tu_usuario" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-1"><Facebook className="h-3 w-3" /> Facebook</label>
                <Input name="facebook" value={form.facebook} onChange={handleChange} placeholder="facebook.com/tu_pagina" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium flex items-center gap-1"><Globe className="h-3 w-3" /> Sitio web</label>
                <Input name="sitioWeb" value={form.sitioWeb} onChange={handleChange} placeholder="https://tusitio.cl" />
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/")}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={enviando}>
              {enviando ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}