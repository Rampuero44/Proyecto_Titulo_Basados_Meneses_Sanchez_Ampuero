import { Link } from "react-router";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

          <div className="flex flex-col gap-3">
            <Link to="/" className="flex items-center gap-2 w-fit">
              <img
                src="/logo-basados.jpg"
                alt="BASADOS"
                className="w-8 h-8 rounded-md object-cover"
              />
              <span className="font-semibold text-base">BASADOS</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              La forma inteligente de planificar y coordinar tus asados.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Navegación</p>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Inicio
              </Link>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Iniciar sesión
              </Link>
              <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Registrarse
              </Link>
              <Link to="/inscripcion-asador" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Inscripción Maestro Asador
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium">Proyecto</p>
            <div className="flex flex-col gap-1 text-sm text-muted-foreground">
              <span>Proyecto de Título {year}</span>
              <span>Analista Programador</span>
              <span>Meneses · Sánchez · Ampuero</span>
            </div>
          </div>

        </div>

        <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>© {year} BASADOS. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <a
              href="https://www.instagram.com/basadoschile?igsh=MWt4OTY2NG1nYzhqOQ=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.facebook.com/share/1F3HfzGwgL/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
