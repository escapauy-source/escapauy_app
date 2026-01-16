import { useAuth } from '@/contexts/AuthContext';

export default function TouristDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">Dashboard Turista</h1>
          <button
            onClick={signOut}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
        <p className="text-slate-600">Bienvenido, {user?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Mis Viajes</h3>
            <p className="text-slate-500 text-sm">Gestiona tus reservas</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Explorar</h3>
            <p className="text-slate-500 text-sm">Descubre nuevos destinos</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Mi Perfil</h3>
            <p className="text-slate-500 text-sm">Configuración</p>
          </div>
        </div>
      </div>
    </div>
  );
}