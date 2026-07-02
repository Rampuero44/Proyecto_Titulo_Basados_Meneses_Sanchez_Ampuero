import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface PerfilUsuario {
  idUsuario: string;
  nombre: string;
  apellido: string | null;
  correo: string;
  rol: string;
  telefono: string | null;
  fechaNacimiento: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  perfil: PerfilUsuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null; user: User | null }>;
  register: (email: string, password: string, nombre: string, fechaNacimiento: string) => Promise<{ error: string | null }>;
  cambiarPassword: (passwordActual: string, passwordNueva: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  const cargarPerfil = async (token?: string) => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/me`,
        { headers }
      );
      if (!response.ok) {
        setPerfil(null);
        return;
      }
      const data: PerfilUsuario = await response.json();
      setPerfil(data);
    } catch {
      setPerfil(null);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await cargarPerfil(session.access_token);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await cargarPerfil(session.access_token);
      } else {
        setPerfil(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: error?.message ?? null, user: null };
    await cargarPerfil(data.session?.access_token);
    return { error: null, user: data.user };
  };

  const register = async (email: string, password: string, nombre: string, fechaNacimiento: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { nombre, fecha_nacimiento: fechaNacimiento }
      }
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("user already exists")) {
        return { error: "Este correo ya está registrado. Intenta iniciar sesión." };
      }
      return { error: error.message };
    }

    return { error: null };
  };

  const cambiarPassword = async (passwordActual: string, passwordNueva: string) => {
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: user?.email ?? "",
      password: passwordActual,
    });
    if (loginError) {
      return { error: "La contraseña actual es incorrecta" };
    }
    const { error } = await supabase.auth.updateUser({ password: passwordNueva });
    if (error) return { error: error.message };
    return { error: null };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setPerfil(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, perfil, loading, login, register, cambiarPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
