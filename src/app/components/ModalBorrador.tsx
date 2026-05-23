import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Flame } from "lucide-react";

interface Props {
  onContinuar: () => void;
  onNuevo: () => void;
}

export function ModalBorrador({ onContinuar, onNuevo }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Flame className="h-7 w-7 text-primary" />
          </div>
          <CardTitle>Tienes un asado en progreso</CardTitle>
          <CardDescription>
            Encontramos un evento que dejaste sin terminar. ¿Quieres retomarlo o comenzar uno nuevo?
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button className="w-full" onClick={onContinuar}>
            Continuar mi asado anterior
          </Button>
          <Button variant="outline" className="w-full" onClick={onNuevo}>
            Crear un nuevo asado
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
