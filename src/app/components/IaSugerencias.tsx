import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { obtenerSugerencias, ProductoIaDTO, LIMITE_IA_ALCANZADO } from "../services/iaApi";
import { ContextoEvento } from "./ModalContextoEvento";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";

interface Props {
  contexto: ContextoEvento;
  productos: ProductoIaDTO[];
}

export function IaSugerencias({ contexto, productos }: Props) {
  const [texto, setTexto] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useDebouncedCallback(
    async () => {
      setCargando(true);
      try {
        const res = await obtenerSugerencias({
          ...contexto,
          productos,
        });
        setTexto(res.texto);
      } catch (error) {
        setTexto(
          error instanceof Error && error.message === LIMITE_IA_ALCANZADO
            ? "Alcanzaste el límite diario de uso de IA. Inténtalo de nuevo mañana."
            : "No se pudieron cargar las sugerencias."
        );
      } finally {
        setCargando(false);
      }
    },
    [productos, contexto],
    1500,
  );

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
