import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { analizarCotizacion, ProductoIaDTO, CotizacionComercioDTO, LIMITE_IA_ALCANZADO } from "../services/iaApi";
import { ContextoEvento } from "./ModalContextoEvento";

interface Props {
  contexto: ContextoEvento;
  productos: ProductoIaDTO[];
  cotizaciones: CotizacionComercioDTO[];
}

export function IaCotizacion({ contexto, productos, cotizaciones }: Props) {
  const [texto, setTexto] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (cotizaciones.length === 0) return;

    setCargando(true);
    analizarCotizacion({ ...contexto, productos, cotizaciones })
      .then((res) => setTexto(res.texto))
      .catch((error) =>
        setTexto(
          error instanceof Error && error.message === LIMITE_IA_ALCANZADO
            ? "Alcanzaste el límite diario de uso de IA. Inténtalo de nuevo mañana."
            : "No se pudo analizar la cotización."
        )
      )
      .finally(() => setCargando(false));
  }, [cotizaciones]);

  if (cotizaciones.length === 0) return null;

  return (
    <div className="rounded-xl border bg-primary/5 p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
        <Sparkles className="size-4" />
        Análisis IA de cotizaciones
      </div>

      {cargando ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Comparando precios y analizando opciones...
        </div>
      ) : texto ? (
        <div className="text-sm text-foreground whitespace-pre-line leading-relaxed">
          {texto}
        </div>
      ) : null}
    </div>
  );
}
