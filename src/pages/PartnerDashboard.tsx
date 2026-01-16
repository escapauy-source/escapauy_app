import { useAuth } from '@/contexts/AuthContext';

export default function PartnerDashboard() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">Dashboard Socio</h1>
          <button
            onClick={signOut}
            className="bg-slate-800 text-red-400 border border-red-900/30 px-4 py-2 rounded-lg hover:bg-red-900/20 transition font-medium text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
        <p className="text-slate-400">Panel de control: {user?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Reservas</h3>
            <p className="text-slate-400 text-sm">Gestionar bookings</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Servicios</h3>
            <p className="text-slate-400 text-sm">Mis ofertas</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Estadísticas</h3>
            <p className="text-slate-400 text-sm">Ingresos</p>
          </div>
        </div>
      </div>
    </div>
  );
}