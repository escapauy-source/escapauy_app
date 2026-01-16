import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { toast } from "sonner";

type AuthContextType = {
  user: any | null;
  session: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // Detectar si estamos volviendo de un login de Google
      const inAuthFlow =
        window.location.search.includes('code=') ||
        window.location.hash.includes('access_token=') ||
        window.location.hash.includes('error_description=');

      // Escuchar cambios en la sesión
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      try {
        // Obtener sesión inicial
        const { data: { session: initialSession } } = await supabase.auth.getSession();

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (!inAuthFlow || initialSession) {
            setLoading(false);
          }
        }
      } catch (err) {
        if (mounted) setLoading(false);
      }

      // Tiempo de espera máximo para el flujo de login
      if (inAuthFlow) {
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, 5000);
      }

      return subscription;
    };

    const subPromise = initAuth();

    return () => {
      mounted = false;
      subPromise.then(sub => sub?.unsubscribe());
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://escapauy.licorescolinadeloscanes.com/auth/v1/callback",
          skipBrowserRedirect: false,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error de inicio de sesión: ${err.message}`);
    }
  };

  const signOut = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (err) {
      window.location.href = '/';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8fafc',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '5px solid #e2e8f0',
          borderBottomColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'rotation 1s linear infinite'
        }}></div>
        <style>{`@keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#64748b', fontFamily: 'sans-serif' }}>Verificando acceso...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}