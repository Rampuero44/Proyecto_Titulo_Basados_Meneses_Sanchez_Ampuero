import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const sincronizarNombre = async (user: User) => {
    if (user.user_metadata?.nombre) return user;

    const { data } = await supabase
      .from("usuarios")
      .select("nombre, rol")
      .eq("correo", user.email)
      .single();

    if (data?.nombre) {
      await supabase.auth.updateUser({
        data: {
          nombre: data.nombre,
          rol: data.rol ?? "usuario"
        }
      });
      const { data: refreshed } = await supabase.auth.getUser();
      return refreshed?.user ?? user;
    }
    return user;
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return { error: error?.message ?? null, user: null };

    const userSincronizado = await sincronizarNombre(data.user);
    return { error: null, user: userSincronizado };
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
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, cambiarPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
