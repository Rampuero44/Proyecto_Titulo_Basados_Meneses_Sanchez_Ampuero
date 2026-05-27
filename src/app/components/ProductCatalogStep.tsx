import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Flame,
  Plus,
  Minus,
  Check,
  ClipboardList,
} from "lucide-react";

import { ProductCategory, Producto } from "../types/product";
import { obtenerProductos } from "../services/productosApi";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface ProductoSeleccionado {
  product: Producto;
  cantidad: number;
}

interface Props {
  seleccionados: ProductoSeleccionado[];
  onChange: (seleccionados: ProductoSeleccionado[]) => void;
  sidebarExtra?: React.ReactNode;
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

const SLUG_A_CATEGORIA: Record<string, ProductCategory> = {
  "vacunos": "proteina",
  "pollo": "proteina",
  "cerdos": "proteina",
  "embutidos-parrilleros": "proteina",
  "pescados-y-mariscos": "proteina",
  "bebidas-y-licores": "bebestible",
  "bebidas-sin-alcohol": "bebestible",
  "verduras": "ensalada",
  "snacks-y-picoteo": "insumo",
  "aceites-y-condimentos": "insumo",
  "carbones-e-insumos": "insumo",
};

const GRUPOS_PROTEINA: Record<string, string[]> = {
  Vacuno: ["Vacuno magro", "Vacuno intermedio", "Vacuno premium", "Vacuno otros"],
  Cerdo: ["Cerdo magro", "Cerdo intermedio", "Cerdo premium", "Cerdo otros"],
  Pollo: ["Pollo magro", "Pollo intermedio", "Pollo premium", "Pollo otros"],
  Cordero: ["Cordero magro", "Cordero intermedio", "Cordero premium", "Cordero otros"],
  Pescados: ["Pescado magro", "Pescado intermedio", "Pescado graso"],
  Mariscos: ["Marisco magro", "Marisco intermedio"],
  Embutidos: ["Embutidos"],
  Vegano: ["Vegano"],
  Interiores: ["Interiores magros", "Interiores intermedios", "Interiores parrilleros"],
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
  product: Producto;
  seleccionado: ProductoSeleccionado | undefined;
  onToggle: () => void;
  onCantidadChange: (delta: number) => void;
}) {
  const isSelected = !!seleccionado;
  const slug = product.slugCategoria ?? product.categoria;
  const badgeClass = CATEGORY_BADGE[SLUG_A_CATEGORIA[slug] ?? slug] ?? "bg-gray-100 text-gray-800 hover:bg-gray-100";
  const categoryLabel = CATEGORY_LABEL[SLUG_A_CATEGORIA[slug] ?? slug] ?? product.categoria;

  return (
    <Card className={`flex flex-col transition-all ${isSelected ? "border-primary ring-1 ring-primary" : "hover:shadow-md"}`}>
      <div className="h-36 bg-white rounded-t-lg overflow-hidden flex items-center justify-center shrink-0">
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            className="h-full w-full object-contain p-2"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="text-4xl select-none opacity-30">🥩</div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight line-clamp-2">{product.nombre}</CardTitle>
          <Badge className={`${badgeClass} shrink-0`}>{categoryLabel}</Badge>
        </div>
        {product.marca && <p className="text-xs text-muted-foreground">{product.marca}</p>}
        {product.pesoGramos != null && product.pesoGramos > 0 && (
          <p className="text-xs text-muted-foreground">
            {product.unidadFormato === "ml"
              ? product.pesoGramos >= 1000 ? `${(product.pesoGramos / 1000).toFixed(1)} L` : `${product.pesoGramos} ml`
              : product.unidadFormato === "un"
                ? `${product.pesoGramos} unidades`
                : product.pesoGramos >= 1000 ? `${(product.pesoGramos / 1000).toFixed(1)} kg` : `${product.pesoGramos} g`}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex-1 pb-2">
        <div className="flex items-center justify-between text-sm">
          {product.calorias != null && product.calorias > 0 && (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Flame className="size-3 text-orange-500" />
              {Math.round(product.calorias)} kcal
            </span>
          )}
          {product.precioDesde != null && product.precioDesde > 0 && (
            <div className="ml-auto text-right">
              <span className="font-semibold text-primary text-sm">Desde {formatPrice(product.precioDesde)}</span>
              {product.precioUnitario && <p className="text-xs text-muted-foreground">{product.precioUnitario}</p>}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 pt-2">
        {isSelected ? (
          <>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">Cantidad:</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="size-7" onClick={() => onCantidadChange(-1)}>
                  <Minus className="size-3" />
                </Button>
                <span className="w-8 text-center font-semibold">{seleccionado.cantidad}</span>
                <Button variant="outline" size="icon" className="size-7" onClick={() => onCantidadChange(1)}>
                  <Plus className="size-3" />
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full text-destructive border-destructive hover:bg-destructive/10" onClick={onToggle}>
              Quitar del evento
            </Button>
          </>
        ) : (
          <Button size="sm" className="w-full" onClick={onToggle}>
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
  onCantidadChange,
  onQuitar,
}: {
  seleccionados: ProductoSeleccionado[];
  onCantidadChange: (product: Producto, delta: number) => void;
  onQuitar: (product: Producto) => void;
}) {
  const total = seleccionados.reduce((acc, s) => acc + (s.product.precioDesde ?? 0) * s.cantidad, 0);

  return (
    <div className="sticky top-24 rounded-xl border bg-muted/30 p-4 space-y-3">
      <div className="flex items-center gap-2 font-semibold text-sm">
        <ClipboardList className="size-4" />
        Resumen del evento
      </div>
      {seleccionados.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">Sin productos aún</p>
      ) : (
        <>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {seleccionados.map((s) => (
              <div key={s.product.id} className="space-y-1">
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs truncate flex-1 leading-tight">{s.product.nombre}</span>
                  <button onClick={() => onQuitar(s.product)} className="text-destructive text-xs shrink-0 hover:underline ml-1">✕</button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="size-5" onClick={() => onCantidadChange(s.product, -1)}>
                      <Minus className="size-2" />
                    </Button>
                    <span className="text-xs w-5 text-center font-semibold">{s.cantidad}</span>
                    <Button variant="outline" size="icon" className="size-5" onClick={() => onCantidadChange(s.product, 1)}>
                      <Plus className="size-2" />
                    </Button>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {s.product.precioDesde != null && s.product.precioDesde > 0
                      ? formatPrice(s.product.precioDesde * s.cantidad)
                      : "Sin precio"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Total estimado</span>
              <span>{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Basado en precio mínimo por producto</p>
          </div>
        </>
      )}
    </div>
  );
}

export function ProductCatalogStep({ seleccionados, onChange, sidebarExtra }: Props) {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "all">("all");
  const [selectedGrupo, setSelectedGrupo] = useState<string>("all");
  const [selectedBebGrupo, setSelectedBebGrupo] = useState<string>("all");
  const [selectedSubtipo, setSelectedSubtipo] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc" | "calories">("name");

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
    if (selectedCategory !== "proteina" || selectedGrupo === "all") return [];
    return GRUPOS_PROTEINA[selectedGrupo] ?? [];
  }, [selectedCategory, selectedGrupo]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat as ProductCategory | "all");
    setSelectedGrupo("all");
    setSelectedSubtipo("all");
    setSelectedBebGrupo("all");
  };

  const filteredProducts = productos.filter((p) => {
    if (!p.precioDesde || p.precioDesde <= 0) return false;
    const matchesSearch = !searchQuery || p.nombre?.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (selectedCategory === "all") return true;

    const slugProducto = p.slugCategoria as string | undefined;
    const categoriaResuelta = slugProducto ? (SLUG_A_CATEGORIA[slugProducto] ?? null) : null;
    if (categoriaResuelta !== selectedCategory) return false;

    // Subfiltro proteína — compara directo con p.tipo que viene del backend
    if (selectedCategory === "proteina" && selectedGrupo !== "all") {
      const tipoProducto = (p.tipo ?? "").toLowerCase();
      if (tipoProducto !== selectedGrupo.toLowerCase()) return false;
      // Subfiltro nivel 2 (magro, intermedio, premium) — busca por keyword en nombre
      if (selectedSubtipo !== "all") {
        const keyword = selectedSubtipo
          .replace(/^(Vacuno|Cerdo|Pollo|Cordero|Pescado|Marisco|Interiores)\s/i, "")
          .toLowerCase();
        if (!p.nombre?.toLowerCase().includes(keyword)) return false;
      }
    }

    // Subfiltro bebestible — compara directo con p.tipo
    if (selectedCategory === "bebestible" && selectedBebGrupo !== "all") {
      const tipoProducto = (p.tipo ?? "").toLowerCase();
      const keyword = (GRUPOS_BEBESTIBLE[selectedBebGrupo] ?? "").toLowerCase();
      if (tipoProducto !== keyword) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name": return a.nombre.localeCompare(b.nombre);
      case "price-asc": return (a.precioDesde ?? Infinity) - (b.precioDesde ?? Infinity);
      case "price-desc": return (b.precioDesde ?? 0) - (a.precioDesde ?? 0);
      case "calories": return (b.calorias ?? 0) - (a.calorias ?? 0);
      default: return 0;
    }
  });

  const toggleProducto = (product: Producto) => {
    const existe = seleccionados.find((s) => s.product.id === product.id);
    if (existe) {
      onChange(seleccionados.filter((s) => s.product.id !== product.id));
    } else {
      onChange([...seleccionados, { product, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (product: Producto, delta: number) => {
    const nuevaCantidad = (seleccionados.find((s) => s.product.id === product.id)?.cantidad ?? 0) + delta;
    if (nuevaCantidad <= 0) {
      onChange(seleccionados.filter((s) => s.product.id !== product.id));
    } else {
      onChange(seleccionados.map((s) => s.product.id === product.id ? { ...s, cantidad: nuevaCantidad } : s));
    }
  };

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-1 space-y-6 min-w-0">

        <div>
          <h2 className="text-2xl font-bold">Selecciona los productos del evento</h2>
          <p className="text-muted-foreground text-sm mt-1">Productos obtenidos desde backend real 🚀</p>
        </div>

        {/* ── Barra búsqueda + orden ── */}
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
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
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

        {/* ── Tabs de categoría ── */}
        <div className="flex flex-wrap gap-2">
          {(["all", "proteina", "bebestible", "ensalada", "insumo"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {cat === "all" ? "Todos"
                : cat === "proteina" ? "Proteínas"
                : cat === "bebestible" ? "Bebestibles"
                : cat === "ensalada" ? "Ensaladas"
                : "Insumos"}
            </button>
          ))}
        </div>

        {/* ── Subfiltros proteína ── */}
        {selectedCategory === "proteina" && (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {Object.keys(GRUPOS_PROTEINA).map((grupo) => (
                <button
                  key={grupo}
                  onClick={() => {
                    setSelectedGrupo(selectedGrupo === grupo ? "all" : grupo);
                    setSelectedSubtipo("all");
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedGrupo === grupo
                      ? "bg-red-600 text-white border-red-600"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {grupo}
                </button>
              ))}
            </div>
            {selectedGrupo !== "all" && subtipesDelGrupo.length > 0 && (
              <div className="flex flex-wrap gap-2 pl-2">
                {subtipesDelGrupo.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubtipo(selectedSubtipo === sub ? "all" : sub)}
                    className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                      selectedSubtipo === sub
                        ? "bg-red-100 text-red-800 border-red-300"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {sub.replace(/^(Vacuno|Cerdo|Pollo|Cordero|Pescado|Marisco|Interiores)\s/, "")}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Subfiltros bebestible ── */}
        {selectedCategory === "bebestible" && (
          <div className="flex flex-wrap gap-2">
            {Object.keys(GRUPOS_BEBESTIBLE).map((grupo) => (
              <button
                key={grupo}
                onClick={() => setSelectedBebGrupo(selectedBebGrupo === grupo ? "all" : grupo)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedBebGrupo === grupo
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-border hover:bg-muted"
                }`}
              >
                {grupo}
              </button>
            ))}
          </div>
        )}

        {/* ── Grid de productos ── */}
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">Cargando productos...</div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No se encontraron productos</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>

      <div className="hidden lg:block w-64 shrink-0 self-start sticky top-24 space-y-4">
        <MiniResumen
          seleccionados={seleccionados}
          onCantidadChange={cambiarCantidad}
          onQuitar={toggleProducto}
        />
        {sidebarExtra}
      </div>
    </div>
  );
}