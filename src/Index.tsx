import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const Index = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: 'tourist' | 'partner') => {
    localStorage.setItem('pending_role', role);
    signInWithGoogle();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-slate-500 font-medium">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-boutique/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl shadow-slate-200/50 max-w-md w-full text-center relative z-10 border border-white/50">
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-2 text-primary tracking-tighter">EscapaUY</h1>
          <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Tu aventura comienza aquí</p>
        </div>

        {user ? (
          <div className="animate-fade-in-up">
            <div className="bg-slate-50 p-6 rounded-2xl mb-6 border border-slate-100">
              <p className="text-sm text-slate-500 mb-1">Bienvenido de nuevo</p>
              <p className="font-bold text-slate-800">{user.email}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-primary text-white font-black py-4 rounded-xl hover:bg-sky-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
              >
                🚀 Ir al Dashboard
              </button>
              <button
                onClick={signOut}
                className="w-full bg-slate-100 text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">
            <div className="space-y-3">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Turistas</p>
              <button
                onClick={() => handleLogin('tourist')}
                className="w-full bg-gradient-to-r from-primary to-sky-500 text-white py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/25 font-black uppercase tracking-wide text-sm flex items-center justify-center gap-2"
              >
                ✨ Soy Nuevo (Registrarse)
              </button>

              <button
                onClick={() => handleLogin('tourist')}
                className="w-full bg-white text-primary border-2 border-primary/10 py-4 rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all font-bold uppercase tracking-wide text-sm flex items-center justify-center gap-2"
              >
                🔑 Ya tengo cuenta
              </button>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Partners</p>
              <button
                onClick={() => handleLogin('partner')}
                className="w-full bg-slate-800 text-white py-4 rounded-xl hover:bg-slate-900 transition-all shadow-lg shadow-slate-900/20 font-black uppercase tracking-wide text-sm flex items-center justify-center gap-2"
              >
                🤝 Acceso Socios
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 mt-8 relative z-10 text-center max-w-xs mx-auto leading-relaxed opacity-60">
        Al ingresar, aceptas nuestros términos de servicio y política de privacidad.
      </p>
    </div>
  );
};

export default Index;