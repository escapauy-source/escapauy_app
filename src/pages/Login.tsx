import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPartnerMode = location.pathname === '/partner-login';
  const hasRedirected = useRef(false);

  const [selectedRole, setSelectedRole] = useState<'tourist' | 'partner' | null>(
    isPartnerMode ? 'partner' : 'tourist'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const { signInWithGoogle, user } = useAuth();

  useEffect(() => {
    setSelectedRole(isPartnerMode ? 'partner' : 'tourist');
  }, [isPartnerMode]);

  useEffect(() => {
    if (user && !hasRedirected.current) {
      hasRedirected.current = true;
      console.log('[Login] User detected, redirecting to dashboard...');
      setTimeout(() => navigate('/dashboard', { replace: true }), 500);
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role: selectedRole },
          },
        });
        if (error) throw error;
        toast.success('¡Cuenta creada! Revisa tu email.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('¡Bienvenido de vuelta!');
      }
    } catch (error: any) {
      const msg = error.message.toLowerCase();
      if (msg.includes('confirm')) {
        toast.warning('Debes confirmar tu email antes de entrar. Revisa tu bandeja.');
      } else if (msg.includes('invalid login')) {
        toast.error('Email o contraseña incorrectos.');
      } else if (msg.includes('already registered')) {
        toast.info('Ya existe una cuenta con este email. Intenta iniciar sesión.');
      } else {
        toast.error(error.message || 'Ocurrió un error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      if (selectedRole) {
        localStorage.setItem('pendingrole', selectedRole);
      }
      await signInWithGoogle();
    } catch (error: any) {
      toast.error('Error al iniciar con Google');
    }
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('error_description')) {
      const params = new URLSearchParams(hash.substring(1));
      const errorDesc = params.get('error_description');
      if (errorDesc) {
        toast.error(`Error de acceso: ${errorDesc.replace(/\+/g, ' ')}`);
      }
    }
  }, []);
  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${
        isPartnerMode ? 'bg-slate-900' : 'bg-slate-950'
      }`}
    >
      <div className={`absolute top-0 left-0 w-full h-full -z-20 ${isPartnerMode ? 'bg-slate-900' : 'bg-slate-950'}`} />
      <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${isPartnerMode ? 'bg-blue-900/20' : 'bg-gold-boutique/20'}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-3xl -z-10 ${isPartnerMode ? 'bg-purple-900/10' : 'bg-gold-boutique/10'}`} />

      <div
        className={`w-full max-w-md p-8 rounded-3xl shadow-xl border animate-fade-in-up ${
          isPartnerMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-900 border-gold-boutique/20'
        }`}
      >
        <div className="text-center mb-6">
          <img src="/images/logo-main.png" alt="EscapaUY" className="h-12 mx-auto mb-4 object-contain" />
        </div>

        {user && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm text-center">
            Ya has iniciado sesión como <strong>{user.email}</strong>.<br />
            Redirigiendo al dashboard...
          </div>
        )}

        <div>
          <div className="text-center mb-8">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                isPartnerMode ? 'bg-blue-500/20 text-blue-400' : 'bg-gold-boutique/20 text-gold-boutique'
              }`}
            >
              {isPartnerMode ? '🛡️ ACCESO SOCIOS' : '✨ MODO TURISTA'}
            </span>
            <h2 className="text-2xl font-heading font-bold text-white">
              {isSignUp ? 'Crea tu cuenta' : 'Inicia Sesión'}
            </h2>
            <p className="text-sm mt-2 text-slate-400">
              {isPartnerMode
                ? 'Gestiona tus servicios y reservas'
                : isSignUp
                ? 'Únete para descubrir escapadas aseguradas'
                : 'Ingresa para ver tus viajes'}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className={`w-full flex items-center justify-center gap-3 border font-medium py-3 px-4 rounded-xl transition-colors shadow-sm ${
                isPartnerMode
                  ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600'
                  : 'bg-slate-800 border-gold-boutique/30 text-white hover:bg-slate-700'
              }`}
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continuar con Google
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-700" />
              <span className="flex-shrink-0 mx-4 text-xs uppercase text-slate-500">O usa tu email</span>
              <div className="flex-grow border-t border-slate-700" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-800 border-slate-600 text-white focus:border-gold-boutique focus:ring-2 focus:ring-gold-boutique/20 outline-none transition-all placeholder:text-slate-600"
                  placeholder={isPartnerMode ? 'socio@empresa.com' : 'hola@ejemplo.com'}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-slate-300">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-slate-800 border-slate-600 text-white focus:border-gold-boutique focus:ring-2 focus:ring-gold-boutique/20 outline-none transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center ${
                  isPartnerMode
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                    : 'bg-gold-boutique hover:bg-gold-boutique-600 text-black shadow-gold-boutique/25'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : isSignUp ? 'Registrarme' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              {isSignUp ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
              <button onClick={() => setIsSignUp(!isSignUp)} className={`font-bold hover:underline ${isPartnerMode ? 'text-blue-400' : 'text-gold-boutique'}`}>
                {isSignUp ? 'Ingresa aquí' : 'Regístrate'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <button
              onClick={() => navigate(isPartnerMode ? '/login' : '/partner-login')}
              className={`text-sm font-bold py-2 px-4 rounded-lg transition-colors ${
                isPartnerMode
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-gold-boutique/10 text-gold-boutique hover:bg-gold-boutique/20'
              }`}
            >
              {isPartnerMode ? '✨ ¿Eres un turista? Entra aquí' : '🛡️ Acceso para Socios y Hoteles'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
