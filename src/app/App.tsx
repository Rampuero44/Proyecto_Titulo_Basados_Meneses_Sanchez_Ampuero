import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { router } from "./routes";
import { useEffect } from "react";
import { initializeData } from "./utils/initializeData";

export default function App() {
  useEffect(() => {
    // Inicializar datos de ejemplo en el primer render
    initializeData();
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}