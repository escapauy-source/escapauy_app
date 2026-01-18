import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowRight, Sparkles, MapPin, Calendar, LogOut, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrips();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const loadTrips = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const { data, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tripsError) {
        console.error('Error loading trips:', tripsError);
        setTrips([]);
      } else {
        setTrips(data || []);
      }
    } catch (err) {
      console.error('Error loading trips:', err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Sesión cerrada correctamente');
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  const upcomingTrips = trips.filter(trip => 
    trip.status === 'generated' || trip.status === 'confirmed'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <header className="border-b border-white/10 bg-navy-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-navy-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">EscapaUY</h1>
                <p className="text-sm text-gray-400">Dashboard Premium</p>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 hover:border-gold-500/50"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bienvenido, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Viajero'}!
          </h2>
          <p className="text-gray-400">
            Tu próxima escapada perfecta te está esperando
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">VIAJES</p>
                <p className="text-3xl font-bold text-gold-500">{trips.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">PRÓXIMOS</p>
                <p className="text-3xl font-bold text-cyan-500">{upcomingTrips}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">DESTINOS</p>
                <p className="text-3xl font-bold text-purple-500">
                  {[...new Set(trips.map(t => t.destination))].filter(Boolean).length || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={() => navigate('/wizard')}
          className="w-full mb-8 p-6 bg-gradient-to-r from-gold-500 to-gold-600 rounded-2xl text-navy-900 hover:from-gold-600 hover:to-gold-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-between group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-navy-900/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold mb-1">Crear Nueva Escapada</h3>
              <p className="text-navy-800">
                Déjanos crear tu experiencia perfecta
              </p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
        </motion.button>
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Mis Escapadas</h3>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Cargando tus escapadas...</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
              <Sparkles className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Aún no tienes escapadas creadas
              </p>
              <button
                onClick={() => navigate('/wizard')}
                className="px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-600 transition-colors font-medium"
              >
                Crear Mi Primera Escapada
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <motion.div
                  key={trip.id}
                  onClick={() => navigate(`/trip/${trip.id}`)}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-gold-500/50 transition-all group cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-bold text-white group-hover:text-gold-500 transition-colors">
                        {trip.destination || 'Escapada'}
                      </h4>
                      <span className="px-3 py-1 bg-gold-500/20 text-gold-500 rounded-full text-xs font-medium">
                        {trip.status === 'generated' ? 'Generado' : trip.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-400">
                      {trip.destination && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold-500" />
                          <span>{trip.destination}</span>
                        </div>
                      )}
                      {trip.dates && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gold-500" />
                          <span>{trip.dates}</span>
                        </div>
                      )}
                      {trip.created_at && (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gold-500" />
                          <span>Creado {new Date(trip.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <button className="mt-6 w-full px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all flex items-center justify-center gap-2 group">
                      <span>Ver Detalles</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
