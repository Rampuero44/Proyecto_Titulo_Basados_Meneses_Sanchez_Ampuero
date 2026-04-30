import { useState } from "react";
import { Search, Filter, Flame, Store, Plus, Minus, Check, ClipboardList } from "lucide-react";
import { mockProducts } from "../data/mockData";
import { ProductCategory, ProductWithPrice } from "../types/product";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

// ─── tipos ───────────────────────────────────────────────────────────────────

export interface ProductoSeleccionado {
  product: ProductWithPrice;
  cantidad: number;
}

interface Props {
  seleccionados: ProductoSeleccionado[];
  onChange: (seleccionados: ProductoSeleccionado[]) => void;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(price);

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

// ─── ProductCard ─────────────────────────────────────────────────────────────

function ProductCard({
  product,
  seleccionado,
  onToggle,
  onCantidadChange,
}: {
  product: ProductWithPrice;
  seleccionado: ProductoSeleccionado | undefined;
  onToggle: () => void;
  onCantidadChange: (delta: number) => void;
}) {
  const isSelected = !!seleccionado;

  return (
    <Card
      className={`flex flex-col transition-all ${
        isSelected ? "border-primary ring-1 ring-primary" : "hover:shadow-md"
      }`}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{product.nombre}</CardTitle>
          <Badge className={CATEGORY_BADGE[product.category] ?? ""}>
            {CATEGORY_LABEL[product.category] ?? product.category}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{product.tipo}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-2">
        <p className="text-xl font-bold">{formatPrice(product.precio.valor)}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className="size-4 text-orange-500" />
            {product.calorias} cal
          </span>
          <span className="flex items-center gap-1">
            <Store className="size-4" />
            {product.comercio.nombre}
          </span>
        </div>
        {"formato" in product && (
          <p className="text-sm">
            <span className="text-muted-foreground">Formato: </span>
            <span className="capitalize">{(product as any).formato}</span>
          </p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-3">
        {isSelected ? (
          <>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">Cantidad:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-7"
                  onClick={() => onCantidadChange(-1)}
                >
                  <Minus className="size-3" />
                </Button>
                <span className="w-8 text-center font-semibold">{seleccionado.cantidad}</span>
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
            <p className="text-xs text-muted-foreground self-end">
              Subtotal: {formatPrice(product.precio.valor * seleccionado.cantidad)}
            </p>
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
          <Button size="sm" className="w-full" onClick={onToggle}>
            <Check className="size-4 mr-2" />
            Incluir en el evento
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// ─── Resumen de seleccionados ─────────────────────────────────────────────────

function ResumenSeleccion({ seleccionados }: { seleccionados: ProductoSeleccionado[] }) {
  const total = seleccionados.reduce(
    (sum, s) => sum + s.product.precio.valor * s.cantidad,
    0
  );
  const calorias = seleccionados.reduce(
    (sum, s) => sum + s.product.calorias * s.cantidad,
    0
  );

  if (seleccionados.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
        <ClipboardList className="size-8 mx-auto mb-2 opacity-40" />
        Aún no has seleccionado productos para el evento
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 font-semibold">
        <ClipboardList className="size-4" />
        Productos del evento ({seleccionados.length})
      </div>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {seleccionados.map((s) => (
          <div key={s.product.id} className="flex items-center justify-between text-sm">
            <span className="truncate flex-1 mr-2">{s.product.nombre}</span>
            <span className="text-muted-foreground shrink-0">
              ×{s.cantidad} · {formatPrice(s.product.precio.valor * s.cantidad)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 flex justify-between text-sm">
        <span className="text-muted-foreground">Costo estimado</span>
        <span className="font-bold">{formatPrice(total)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Calorías totales</span>
        <span className="font-medium">{Math.round(calorias).toLocaleString()} kcal</span>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export function ProductCatalogStep({ seleccionados, onChange }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "calories">("name");

  const getCategoryCount = (category: ProductCategory) =>
    mockProducts.filter((p) => p.category === category).length;

  const filteredProducts = mockProducts.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tipo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":       return a.nombre.localeCompare(b.nombre);
      case "price-asc":  return a.precio.valor - b.precio.valor;
      case "price-desc": return b.precio.valor - a.precio.valor;
      case "calories":   return a.calorias - b.calorias;
      default:           return 0;
    }
  });

  const toggleProducto = (product: ProductWithPrice) => {
    const existe = seleccionados.find((s) => s.product.id === product.id);
    if (existe) {
      onChange(seleccionados.filter((s) => s.product.id !== product.id));
    } else {
      onChange([...seleccionados, { product, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (product: ProductWithPrice, delta: number) => {
    onChange(
      seleccionados.map((s) =>
        s.product.id === product.id
          ? { ...s, cantidad: Math.max(1, s.cantidad + delta) }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Selecciona los productos del evento</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Elige qué incluir en tu asado. Puedes ajustar las cantidades directamente en cada producto.
        </p>
      </div>

      <ResumenSeleccion seleccionados={seleccionados} />

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
        <Select value={sortBy} onValueChange={(v: typeof sortBy) => setSortBy(v)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre A-Z</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="calories">Calorías</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs
        value={selectedCategory}
        onValueChange={(v) => setSelectedCategory(v as typeof selectedCategory)}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">Todos ({mockProducts.length})</TabsTrigger>
          <TabsTrigger value="proteina">Proteínas ({getCategoryCount("proteina")})</TabsTrigger>
          <TabsTrigger value="bebestible">Bebestibles ({getCategoryCount("bebestible")})</TabsTrigger>
          <TabsTrigger value="insumo">Insumos ({getCategoryCount("insumo")})</TabsTrigger>
          <TabsTrigger value="ensalada">Ensaladas ({getCategoryCount("ensalada")})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {sortedProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No se encontraron productos
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  seleccionado={seleccionados.find((s) => s.product.id === product.id)}
                  onToggle={() => toggleProducto(product)}
                  onCantidadChange={(delta) => cambiarCantidad(product, delta)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
