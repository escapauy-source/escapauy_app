import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  LogOut,
  CheckCircle,
  Download,
  Share2,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      loadTrip();
    } else {
      navigate('/');
    }
  }, [id, user, navigate]);

  const loadTrip = async () => {
    if (!id || !user) return;

    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error loading trip:', error);
        toast.error('No se pudo cargar el viaje');
        navigate('/dashboard');
        return;
      }

      setTrip(data);
    } catch (error) {
      console.error('Error loading trip:', error);
      toast.error('Error al cargar el viaje');
      navigate('/dashboard');
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

  const handleShare = () => {
    toast.success('Función de compartir próximamente');
  };

  const handleDownload = () => {
    toast.success('Función de descarga próximamente');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Cargando tu escapada...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  const itinerary = trip.itinerary || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      {/* Header con botón de logout */}
      <header className="border-b border-white/10 bg-navy-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </button>

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

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-gold-500/20 to-purple-500/20 rounded-3xl p-8 border border-white/10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8 text-gold-500" />
                  <h1 className="text-4xl font-bold text-white">
                    {trip.destination || 'Tu Escapada'}
                  </h1>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gold-500" />
                    <span>{trip.dates || `${trip.days || 2} días`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gold-500" />
                    <span>{trip.destination || 'Uruguay'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold-500" />
                    <span>Creado {new Date(trip.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                ✓ Generado
              </span>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Perfil ADN */}
        {itinerary.personality && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-gold-500" />
                Tu Perfil ADN Viajero
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {itinerary.personality}
              </p>
            </div>
          </motion.div>
        )}

        {/* Itinerario por días */}
        {itinerary.recommendations && itinerary.recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Itinerario Detallado</h2>
            <div className="space-y-4">
              {itinerary.recommendations.map((dayPlan: any, index: number) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:border-gold-500/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gold-500/20 rounded-xl flex items-center justify-center">
                      <span className="text-gold-500 font-bold">{dayPlan.day || index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">
                        Día {dayPlan.day || index + 1}
                      </h3>
                      <ul className="space-y-2">
                        {dayPlan.activities && dayPlan.activities.map((activity: string, actIndex: number) => (
                          <li key={actIndex} className="flex items-start gap-2 text-gray-300">
                            <CheckCircle className="w-5 h-5 text-gold-500 flex-shrink-0 mt-0.5" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Información Importante</h2>
          <div className="space-y-3 text-gray-300">
            <p>✓ Itinerario personalizado según tu perfil psicométrico</p>
            <p>✓ Actividades adaptadas a tus preferencias de viaje</p>
            <p>✓ Recomendaciones locales auténticas</p>
            <p>✓ Flexibilidad para ajustar según el clima</p>
          </div>
        </motion.div>

        {/* Botón para crear otro viaje */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => navigate('/wizard')}
            className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-900 font-bold rounded-lg transition-all shadow-xl hover:shadow-2xl"
          >
            Crear Otra Escapada
          </button>
        </motion.div>
      </main>
    </div>
  );
}
