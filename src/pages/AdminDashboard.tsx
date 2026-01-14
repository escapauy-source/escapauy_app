import { useAuth } from '@/contexts/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-8">Panel Admin</h1>
        <p className="text-slate-400">Administrador: {user?.email}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Usuarios</h3>
            <p className="text-4xl font-black text-primary mt-4">247</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Socios</h3>
            <p className="text-4xl font-black text-gold-boutique mt-4">18</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Reservas</h3>
            <p className="text-4xl font-black text-emerald-500 mt-4">142</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="font-bold text-lg mb-2">Ingresos</h3>
            <p className="text-4xl font-black text-green-500 mt-4">$54K</p>
          </div>
        </div>
      </div>
    </div>
  );
}