import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * Nota: Dado que el entorno actual no tiene acceso a módulos externos vía npm,
 * se utiliza el cliente de Supabase cargado mediante un script global en el HTML.
 */

// Mock de toast para evitar errores si 'sonner' no está disponible en el entorno
const toast = {
  error: (msg) => console.error("Toast Error:", msg),
  success: (msg) => console.log("Toast Success:", msg)
};

// Configuración de Supabase
const supabaseUrl = ""; // Rellenar con tu URL de proyecto
const supabaseAnonKey = ""; // Rellenar con tu Anon Key
let supabase = null;

if (typeof window !== 'undefined' && window.supabase) {
    supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
} else {
    supabase = {
        auth: {
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            getSession: async () => ({ data: { session: null } }),
            signInWithOAuth: async () => ({ error: { message: "Supabase no cargado" } }),
            signOut: async () => {}
        }
    };
}

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
      const inAuthFlow =
        window.location.search.includes('code=') ||
        window.location.hash.includes('access_token=') ||
        window.location.hash.includes('error_description=');

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      });

      try {
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
          redirectTo: `${window.location.origin}${window.location.pathname}`,
          skipBrowserRedirect: false,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
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

// El entorno requiere un componente App como exportación por defecto para renderizar
export default function App() {
  return (
    <AuthProvider>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1>Auth Provider Loaded</h1>
        <p>El sistema de autenticación está listo para usarse.</p>
      </div>
    </AuthProvider>
  );
}