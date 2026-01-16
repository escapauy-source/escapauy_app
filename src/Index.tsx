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
        <h1 className="text-2xl font-bold mb-6 text-blue-600">EscapaUY</h1>

        {user ? (
          <div>
            <p className="mb-4">Bienvenido, <strong>{user.email}</strong></p>
            <button
              onClick={signOut}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-6 text-gray-600">Inicia sesión para gestionar tus reservas.</p>
            <button
              onClick={signInWithGoogle}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Entrar con Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;