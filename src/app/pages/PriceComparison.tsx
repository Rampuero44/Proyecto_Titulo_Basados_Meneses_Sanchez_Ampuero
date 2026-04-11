import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Store, DollarSign, MapPin } from "lucide-react";
import { storage, Comercio } from "../utils/localStorage";
import { initializeMockData } from "../utils/mockData";
import { toast } from "sonner";

export function PriceComparison() {
  const navigate = useNavigate();
  const [comercios, setComercios] = useState<Comercio[]>([]);
  const currentUsuario = storage.getCurrentUsuario();

  useEffect(() => {
    initializeMockData();

    const loadedComercios = storage.getComercios();
    setComercios(loadedComercios);
  }, []);

  // Precios de ejemplo para cada comercio
  const preciosPorComercio = [
    {
      comercioId: 1,
      items: [
        { nombre: "Carne de res (kg)", precio: 8000 },
        { nombre: "Pollo (kg)", precio: 3500 },
        { nombre: "Chorizo (unidad)", precio: 800 },
        { nombre: "Cerveza pack 6", precio: 6000 },
        { nombre: "Carbón", precio: 5000 },
      ]
    },
    {
      comercioId: 2,
      items: [
        { nombre: "Carne de res (kg)", precio: 8500 },
        { nombre: "Pollo (kg)", precio: 3200 },
        { nombre: "Chorizo (unidad)", precio: 900 },
        { nombre: "Cerveza pack 6", precio: 5500 },
        { nombre: "Carbón", precio: 5500 },
      ]
    },
    {
      comercioId: 3,
      items: [
        { nombre: "Carne de res (kg)", precio: 7500 },
        { nombre: "Pollo (kg)", precio: 3800 },
        { nombre: "Chorizo (unidad)", precio: 750 },
        { nombre: "Cerveza pack 6", precio: 6200 },
        { nombre: "Carbón", precio: 4800 },
      ]
    },
  ];

  const calcularTotal = (comercioId: number) => {
    const precios = preciosPorComercio.find(p => p.comercioId === comercioId);
    if (!precios) return 0;
    return precios.items.reduce((sum, item) => sum + item.precio, 0);
  };

  const mejorPrecio = comercios.length > 0 ? Math.min(...comercios.map(c => calcularTotal(c.id))) : 0;

  const handleSeleccionarComercio = (comercioNombre: string) => {
    localStorage.setItem("comercioSeleccionado", comercioNombre);
    toast.success(`${comercioNombre} seleccionado como referencia de compra`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(currentUsuario ? "/dashboard" : "/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentUsuario ? "Volver al Dashboard" : "Volver al inicio"}
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Comparador de Precios</h1>
          <p className="text-muted-foreground mt-2">
            Compara precios entre diferentes comercios para tu asado
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {comercios.map((comercio) => {
            const precios = preciosPorComercio.find(p => p.comercioId === comercio.id);
            const total = calcularTotal(comercio.id);
            const esMejorPrecio = total === mejorPrecio;

            return (
              <Card 
                key={comercio.id} 
                className={esMejorPrecio ? "border-primary shadow-lg" : ""}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-primary" />
                      <CardTitle>{comercio.nombre}</CardTitle>
                    </div>
                    {esMejorPrecio && (
                      <Badge variant="default">Mejor Precio</Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {comercio.ubicacion}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {precios?.items.map((item, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between items-center py-2 border-b last:border-0"
                      >
                        <span className="text-sm text-muted-foreground">{item.nombre}</span>
                        <span className="font-medium">${item.precio.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total
                      </span>
                      <span className={`font-bold text-lg ${esMejorPrecio ? 'text-primary' : ''}`}>
                        ${total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <Button 
                    className="w-full" 
                    variant={esMejorPrecio ? "default" : "outline"}
                    onClick={() => handleSeleccionarComercio(comercio.nombre)}
                  >
                    {esMejorPrecio ? "Usar mejor opción" : "Seleccionar comercio"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {comercios.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Store className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg mb-2">No hay comercios disponibles</h3>
              <p className="text-muted-foreground text-center">
                Los comercios se cargarán automáticamente
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
