import { useEffect, useRef, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { obtenerSugerencias, ProductoIaDTO } from "../services/iaApi";
import { ContextoEvento } from "./ModalContextoEvento";

interface Props {
  contexto: ContextoEvento;
  productos: ProductoIaDTO[];
}

export function IaSugerencias({ contexto, productos }: Props) {
  const [texto, setTexto] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setCargando(true);
      try {
        const res = await obtenerSugerencias({
          ...contexto,
          productos,
        });
        setTexto(res.texto);
      } catch {
        setTexto("No se pudieron cargar las sugerencias.");
      } finally {
        setCargando(false);
      }
    }, 1500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [productos, contexto]);

  return (
    <div className="rounded-xl border bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Sparkles className="size-4" />
        Sugerencias IA
      </div>

      {cargando ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Analizando tu selección...
        </div>
      ) : texto ? (
        <div className="text-sm text-foreground whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto pr-1">
          {texto}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground italic">
          Agrega productos para recibir recomendaciones.
        </p>
      )}
    </div>
  );
}
