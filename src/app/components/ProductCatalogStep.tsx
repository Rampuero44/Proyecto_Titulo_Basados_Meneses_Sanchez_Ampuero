import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Flame,
  Store,
  Plus,
  Minus,
  Check,
  ClipboardList,
} from "lucide-react";

import { ProductCategory, ProductWithPrice } from "../types/product";
import { obtenerProductos } from "../services/productosApi";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface ProductoSeleccionado {
  product: ProductWithPrice;
  cantidad: number;
}

interface Props {
  seleccionados: ProductoSeleccionado[];
  onChange: (seleccionados: ProductoSeleccionado[]) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(price);

const CATEGORY_BADGE: Record<string, string> = {
  proteina: "bg-red-100 text-red-800 hover:bg-red-100",
  bebestible: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  insumo: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  ensalada: "bg-green-100 text-green-800 hover:bg-green-100",
};

const CATEGORY_LABEL: Record<string, string> = {
  proteina: "Proteína",
  bebestible: "Bebestible",
  insumo: "Insumo",
  ensalada: "Ensalada",
};

const GRUPOS_PROTEINA: Record<string, string[]> = {
  Vacuno: [
    "Vacuno magro",
    "Vacuno intermedio",
    "Vacuno premium",
    "Vacuno otros",
  ],
  Cerdo: [
    "Cerdo magro",
    "Cerdo intermedio",
    "Cerdo premium",
    "Cerdo otros",
  ],
  Pollo: [
    "Pollo magro",
    "Pollo intermedio",
    "Pollo premium",
    "Pollo otros",
  ],
  Cordero: [
    "Cordero magro",
    "Cordero intermedio",
    "Cordero premium",
    "Cordero otros",
  ],
  Pescados: [
    "Pescado magro",
    "Pescado intermedio",
    "Pescado graso",
  ],
  Mariscos: [
    "Marisco magro",
    "Marisco intermedio",
  ],
  Embutidos: ["Embutidos"],
  Vegano: ["Vegano"],
  Interiores: [
    "Interiores magros",
    "Interiores intermedios",
    "Interiores parrilleros",
  ],
};

const GRUPOS_BEBESTIBLE_CON_ALCOHOL: Record<string, string> = {
  Cervezas: "Cerveza",
  Vinos: "Vino",
  Destilados: "Destilado",
};

const GRUPOS_BEBESTIBLE_SIN_ALCOHOL: Record<string, string> = {
  Gaseosas: "Gaseosa",
  Jugos: "Jugo",
  Aguas: "Agua",
};

const GRUPOS_BEBESTIBLE: Record<string, string> = {
  ...GRUPOS_BEBESTIBLE_SIN_ALCOHOL,
  ...GRUPOS_BEBESTIBLE_CON_ALCOHOL,
};

function ProductCard({
  product,
  seleccionado,
  onToggle,
  onCantidadChange,
}: {
  product: any;
  seleccionado: ProductoSeleccionado | undefined;
  onToggle: () => void;
  onCantidadChange: (delta: number) => void;
}) {
  const isSelected = !!seleccionado;

  return (
    <Card
      className={`flex flex-col transition-all ${
        isSelected
          ? "border-primary ring-1 ring-primary"
          : "hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {product.nombre}
          </CardTitle>

          <Badge className={CATEGORY_BADGE[product.category] ?? ""}>
            {CATEGORY_LABEL[product.category] ?? product.category}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {product.tipo}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <div className="flex items-baseline gap-1">
          <p className="text-xl font-bold">
            {formatPrice(product.precioReferencia ?? 0)}
          </p>

          <span className="text-xs text-muted-foreground">
            /kg
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {product.calorias > 0 && (
            <span className="flex items-center gap-1">
              <Flame className="size-4 text-orange-500" />
              {product.calorias} cal
            </span>
          )}

          <span className="flex items-center gap-1">
            <Store className="size-4" />
            {product.comercio?.nombre ?? "Sin comercio"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        {isSelected ? (
          <>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                Cantidad:
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => onCantidadChange(-1)}
                >
                  <Minus className="size-3" />
                </Button>

                <span className="w-8 text-center font-semibold">
                  {seleccionado.cantidad}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => onCantidadChange(1)}
                >
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-destructive border-destructive hover:bg-destructive/10"
              onClick={onToggle}
            >
              Quitar del evento
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="w-full"
            onClick={onToggle}
          >
            <Check className="size-4 mr-2" />
            Agregar al evento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function MiniResumen({
  seleccionados,
}: {
  seleccionados: ProductoSeleccionado[];
}) {
  const total = seleccionados.reduce(
    (sum, s) =>
      sum + (s.product.precioReferencia ?? 0) * s.cantidad,
    0
  );

  return (
    <div className="sticky top-24 rounded-xl border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 font-semibold text-sm">
        <ClipboardList className="size-4" />
        Resumen del evento
      </div>

      {seleccionados.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">
          Sin productos aún
        </p>
      ) : (
        <>
          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {seleccionados.map((s) => (
              <div
                key={s.product.id}
                className="flex justify-between text-xs"
              >
                <span className="truncate flex-1 mr-2">
                  {s.product.nombre}
                </span>

                <span className="text-muted-foreground shrink-0">
                  ×{s.cantidad}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function ProductCatalogStep({
  seleccionados,
  onChange,
}: Props) {

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | "all">("all");

  const [selectedGrupo, setSelectedGrupo] =
    useState<string>("all");

  const [selectedBebGrupo, setSelectedBebGrupo] =
    useState<string>("all");

  const [selectedSubtipo, setSelectedSubtipo] =
    useState<string>("all");

  const [sortBy, setSortBy] = useState<
    "name" | "price-asc" | "price-desc" | "calories"
  >("name");

  useEffect(() => {

    const cargarProductos = async () => {

      try {

        const data = await obtenerProductos();

        console.log("PRODUCTOS API:", data);

        setProductos(data);

      } catch (error) {

        console.error("Error cargando productos:", error);

      } finally {

        setLoading(false);

      }
    };

    cargarProductos();

  }, []);

  const subtipesDelGrupo = useMemo(() => {

    if (
      selectedCategory !== "proteina" ||
      selectedGrupo === "all"
    ) {
      return [];
    }

    return GRUPOS_PROTEINA[selectedGrupo] ?? [];

  }, [selectedCategory, selectedGrupo]);

  const handleCategoryChange = (cat: string) => {

    setSelectedCategory(cat as ProductCategory | "all");

    setSelectedGrupo("all");
    setSelectedSubtipo("all");
    setSelectedBebGrupo("all");
  };

  const filteredProducts = productos.filter((p) => {

    const matchesSearch =
      p.nombre?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {

    switch (sortBy) {

      case "name":
        return a.nombre.localeCompare(b.nombre);

      default:
        return 0;
    }
  });

  const toggleProducto = (product: any) => {

    const existe = seleccionados.find(
      (s) => s.product.id === product.id
    );

    if (existe) {

      onChange(
        seleccionados.filter(
          (s) => s.product.id !== product.id
        )
      );

    } else {

      onChange([
        ...seleccionados,
        {
          product,
          cantidad: 1,
        },
      ]);
    }
  };

  const cambiarCantidad = (product: any, delta: number) => {

    onChange(
      seleccionados.map((s) =>
        s.product.id === product.id
          ? {
              ...s,
              cantidad: Math.max(1, s.cantidad + delta),
            }
          : s
      )
    );
  };

  return (
    <div className="flex gap-6 items-start">

      <div className="flex-1 space-y-6 min-w-0">

        <div>
          <h2 className="text-2xl font-bold">
            Selecciona los productos del evento
          </h2>

          <p className="text-muted-foreground text-sm mt-1">
            Productos obtenidos desde backend real 🚀
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />

            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={(v: any) => setSortBy(v)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="size-4 mr-2" />
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="name">
                Nombre A-Z
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (

          <div className="text-center py-16 text-muted-foreground">
            Cargando productos...
          </div>

        ) : sortedProducts.length === 0 ? (

          <div className="text-center py-16 text-muted-foreground">
            No se encontraron productos
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {sortedProducts.map((product) => (

              <ProductCard
                key={product.id}
                product={product}
                seleccionado={seleccionados.find(
                  (s) =>
                    s.product.id === product.id
                )}
                onToggle={() => toggleProducto(product)}
                onCantidadChange={(delta) =>
                  cambiarCantidad(product, delta)
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden lg:block w-64 shrink-0 self-start sticky top-24">
        <MiniResumen seleccionados={seleccionados} />
      </div>
    </div>
  );
}