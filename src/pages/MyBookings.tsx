import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle,
  Sparkles,
  LogOut,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function MyBookings() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  const loadBookings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading bookings:', error);
        setBookings([]);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setBookings([]);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'generated':
        return 'text-green-500 bg-green-500/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/20';
      case 'cancelled':
        return 'text-red-500 bg-red-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'generated':
        return 'Generado';
      case 'pending':
        return 'Pendiente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Header con botón de logout */}
      <header className="border-b border-white/10 bg-navy-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-white">Mis Reservas</h1>
                <p className="text-sm text-gray-400">Gestiona tus viajes y reservas</p>
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

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Cargando tus reservas...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <Sparkles className="w-16 h-16 text-gold-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                No tienes reservas aún
              </h3>
              <p className="text-gray-400 mb-6">
                Comienza a planificar tu próximo viaje en el asistente IA
              </p>
              <button
                onClick={() => navigate('/wizard')}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors"
              >
                Crear Viaje
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                onClick={() => navigate(`/trip/${booking.id}`)}
                className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-gold-500/50 transition-all cursor-pointer group"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-gold-500 transition-colors">
                        {booking.destination || 'Escapada'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      {booking.dates && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gold-500" />
                          <span>{booking.dates}</span>
                        </div>
                      )}
                      {booking.destination && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gold-500" />
                          <span>{booking.destination}</span>
                        </div>
                      )}
                      {booking.created_at && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gold-500" />
                          <span>Creado {new Date(booking.created_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <button className="px-4 py-2 bg-gold-500/20 hover:bg-gold-500/30 text-gold-500 rounded-lg transition-all text-sm font-medium">
                      Ver Detalles
                    </button>
                  </div>
                </div>

                {booking.itinerary?.recommendations && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm">
                      {booking.itinerary.recommendations.length} días de actividades planificadas
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Botón flotante para crear nuevo viaje */}
        {bookings.length > 0 && (
          <motion.button
            onClick={() => navigate('/wizard')}
            className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 rounded-full shadow-2xl hover:shadow-gold-500/50 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </main>
    </div>
  );
}
