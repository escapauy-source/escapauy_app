import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

const Index = () => {
  const { user, signInWithGoogle, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isCallback = location.pathname.includes('auth/v1/callback');

  useEffect(() => {
    if (user && isCallback) {
      // Si ya tenemos usuario y estamos en la ruta de callback, ir al Dashboard
      navigate("/dashboard", { replace: true });
    } else if (user && location.pathname === "/") {
      // Validación extra: si entra directo al home y ya tiene sesión, ir al dash
      navigate("/dashboard", { replace: true });
    }
  }, [user, isCallback, navigate]);

  const handleLogin = (role: 'tourist' | 'partner') => {
    localStorage.setItem('pending_role', role);
    signInWithGoogle();
  };

  if (loading || (isCallback && !user)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Procesando inicio de sesión...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-600">EscapaUY</h1>
        <p className="text-gray-500 mb-8">Tu aventura comienza aquí</p>

        {user ? (
          <div>
            <p className="mb-4">Bienvenido, <strong>{user.email}</strong></p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Ir al Dashboard
              </button>
              <button
                onClick={signOut}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="mb-4 text-gray-600">¿Cómo quieres ingresar hoy?</p>

            <button
              onClick={() => handleLogin('tourist')}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold shadow-sm"
            >
              🏖️ Soy Turista
            </button>

            <button
              onClick={() => handleLogin('partner')}
              className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition flex items-center justify-center gap-2 font-semibold shadow-sm"
            >
              🤝 Soy Partner
            </button>

            <div className="pt-4 border-t border-gray-100 mt-6">
              <p className="text-xs text-gray-400">Al continuar, aceptas nuestros términos y condiciones.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;