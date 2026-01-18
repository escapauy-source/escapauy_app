import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Users, 
  User, 
  Heart, 
  UsersRound,
  Briefcase,
  MapPin,
  Calendar,
  Mountain,
  Palmtree,
  Building2,
  Waves
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

interface FormData {
  fullName: string;
  fiscalResidence: string;
  travelCircle: 'solo' | 'pareja' | 'familia' | 'amigos' | '';
  destination: string;
  days: number;
  answers: Record<string, string>;
}

const DESTINATIONS = [
  { id: 'auto', name: 'DISEÑA MI RUTA SEGÚN MI ADN', subtitle: 'Algoritmo Genéticamente Personalizado', icon: Sparkles, special: true },
  { id: 'colonia', name: 'COLONIA DEL SACRAMENTO', icon: Building2 },
  { id: 'carmelo', name: 'CARMELO', icon: Palmtree },
  { id: 'helvecia', name: 'NUEVA HELVECIA', icon: Mountain },
  { id: 'conchillas', name: 'CONCHILLAS', icon: Waves },
  { id: 'valdense', name: 'COLONIA VALDENSE', icon: Mountain },
  { id: 'tarariras', name: 'TARARIRAS', icon: Waves },
  { id: 'lacaze', name: 'JUAN LACAZE', icon: Building2 },
  { id: 'rosario', name: 'ROSARIO', icon: Palmtree },
  { id: 'santaana', name: 'SANTA ANA', icon: Waves },
  { id: 'artilleros', name: 'ARTILLEROS', icon: Mountain },
  { id: 'costa', name: 'COSTA DEL INMIGRANTE', icon: Waves },
];

const QUESTIONS = [
  {
    id: 'energy',
    dimension: 'ENERGÍA SOCIAL',
    question: '¿CUÁL ES TU AMBIENTE IDEAL?',
    options: [
      { value: 'social', label: 'PARADOR SOCIAL', sublabel: 'MÚSICA & GENTE' },
      { value: 'zen', label: 'RINCÓN ZEN', sublabel: 'SILENCIO & RÍO' }
    ]
  },
  {
    id: 'planning',
    dimension: 'PLANIFICACIÓN',
    question: '¿CÓMO MANEJAS EL TIEMPO?',
    options: [
      { value: 'structured', label: 'AGENDA MILIMÉTRICA', sublabel: 'CONTROL TOTAL' },
      { value: 'spontaneous', label: 'SORPRESA ESPONTÁNEA', sublabel: 'FLIRTEO CON EL CAOS' }
    ]
  },
  {
    id: 'exploration',
    dimension: 'APERTURA',
    question: '¿QUÉ BUSCAS DESCUBRIR?',
    options: [
      { value: 'explorer', label: 'TESOROS OCULTOS', sublabel: 'AVENTURA REAL' },
      { value: 'classic', label: 'CLÁSICOS PROBADOS', sublabel: 'TRADICIÓN SEGURA' }
    ]
  },
  {
    id: 'service',
    dimension: 'PREFERENCIA',
    question: '¿TU ESTILO DE SERVICIO?',
    options: [
      { value: 'community', label: 'COMUNIDAD', sublabel: 'EXPERIENCIA COMPARTIDA' },
      { value: 'boutique', label: 'BOUTIQUE', sublabel: 'PRIVADO & EXCLUSIVO' }
    ]
  },
  {
    id: 'resilience',
    dimension: 'RESILIENCIA',
    question: '¿Y SI LLUEVE?',
    options: [
      { value: 'adaptable', label: 'ADAPTACIÓN TOTAL', sublabel: 'BAILAR BAJO LA LLUVIA' },
      { value: 'planb', label: 'GARANTÍA PLAN B', sublabel: 'SEGURIDAD ANTE TODO' }
    ]
  }
];

export default function TouristWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    fiscalResidence: '',
    travelCircle: '',
    destination: '',
    days: 2,
    answers: {}
  });

  const handleNext = () => {
    if (step === 1 && (!formData.fullName || !formData.fiscalResidence)) {
      toast.error('Por favor completa todos los campos');
      return;
    }
    if (step === 2 && !formData.travelCircle) {
      toast.error('Por favor selecciona una opción');
      return;
    }
    
    if (step === 2) {
      setStep(3); // Ir a preguntas
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleQuestionAnswer = (questionId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
    
    // Auto-avanzar a la siguiente pregunta
    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setStep(4); // Ir a selección final
      }
    }, 300);
  };

  const generateItinerary = async (answers: Record<string, string>) => {
    // Generar itinerario basado en respuestas
    const destination = formData.destination === 'auto' 
      ? DESTINATIONS[Math.floor(Math.random() * (DESTINATIONS.length - 1)) + 1].name
      : DESTINATIONS.find(d => d.id === formData.destination)?.name || 'Uruguay';

    return {
      destination,
      days: formData.days,
      dates: `${formData.days} días`,
      personality: Object.values(answers).join(', '),
      recommendations: [
        { day: 1, activities: ['Llegada y check-in', 'Exploración local', 'Cena típica'] },
        { day: 2, activities: ['Tour guiado', 'Tiempo libre', 'Experiencia cultural'] }
      ],
      created_at: new Date().toISOString()
    };
  };

  const handleComplete = async () => {
    if (!formData.destination) {
      toast.error('Por favor selecciona un destino');
      return;
    }

    if (!user) {
      toast.error('Debes iniciar sesión');
      navigate('/');
      return;
    }

    try {
      setLoading(true);
      toast.success('¡Perfil ADN guardado exitosamente!');

      // 1. Guardar perfil psicométrico
      const { data: profileData, error: profileError } = await supabase
        .from('psychometric_profiles')
        .upsert({
          user_id: user.id,
          responses: formData.answers,
          travel_circle: formData.travelCircle,
          full_name: formData.fullName,
          fiscal_residence: formData.fiscalResidence,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (profileError) {
        console.error('Error saving profile:', profileError);
        throw profileError;
      }

      // 2. Generar itinerario
      const itinerary = await generateItinerary(formData.answers);

      // 3. Guardar el viaje
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          profile_id: profileData.id,
          destination: itinerary.destination,
          dates: itinerary.dates,
          days: formData.days,
          itinerary: itinerary,
          status: 'generated',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (tripError) {
        console.error('Error saving trip:', tripError);
        throw tripError;
      }

      toast.success('¡Escapada generada exitosamente!');
      
      // 4. CORRECCIÓN: Redirigir a la página del viaje en vez de /my-bookings
      navigate(`/trip/${tripData.id}`);
      
    } catch (error: any) {
      console.error('Error completing wizard:', error);
      toast.error(error.message || 'Hubo un error al generar tu escapada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full filter blur-3xl" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6">
          {step > 1 && (
            <button
              onClick={() => {
                if (step === 3 && currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1);
                } else if (step === 4) {
                  setStep(3);
                  setCurrentQuestion(QUESTIONS.length - 1);
                } else {
                  setStep(step - 1);
                }
              }}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>ATRÁS</span>
            </button>
          )}
        </div>

        {/* Progress */}
        <div className="px-6 mb-8">
          <div className="text-center text-gray-400 text-sm mb-4">
            PASO {step}/4
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Identidad */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    IDENTIDAD <span className="text-gold-500">FISCAL</span>
                  </h2>
                  <p className="text-gray-400 text-sm">VALIDACIÓN LEY 19.210</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white mb-2 text-sm">NOMBRE COMPLETO</label>
                    <input
                      type="text"
                      placeholder="TU NOMBRE..."
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value.toUpperCase() })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white mb-2 text-sm">RESIDENCIA FISCAL</label>
                    <select
                      value={formData.fiscalResidence}
                      onChange={(e) => setFormData({ ...formData, fiscalResidence: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-gold-500"
                    >
                      <option value="" disabled>SELECCIONAR PAÍS...</option>
                      <option value="Uruguay">🇺🇾 Uruguay</option>
                               <option value="Argentina">🇦🇷 Argentina</option>
                      <option value="Brasil">🇧🇷 Brasil</option>
                      <option value="Internacional">🌎 Internacional</option>
                    </select>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors"
                  >
                    SIGUIENTE
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Círculo de viaje */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    TU <span className="text-gold-500">CÍRCULO</span>
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setFormData({ ...formData, travelCircle: 'solo' })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.travelCircle === 'solo'
                        ? 'border-gold-500 bg-gold-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <User className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                    <p className="text-white font-bold">SOLO</p>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, travelCircle: 'pareja' })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.travelCircle === 'pareja'
                        ? 'border-gold-500 bg-gold-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <Heart className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                    <p className="text-white font-bold">PAREJA</p>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, travelCircle: 'familia' })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.travelCircle === 'familia'
                        ? 'border-gold-500 bg-gold-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <Users className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                    <p className="text-white font-bold">FAMILIA</p>
                  </button>

                  <button
                    onClick={() => setFormData({ ...formData, travelCircle: 'amigos' })}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      formData.travelCircle === 'amigos'
                        ? 'border-gold-500 bg-gold-500/20'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <UsersRound className="w-8 h-8 text-gold-500 mx-auto mb-3" />
                    <p className="text-white font-bold">AMIGOS</p>
                  </button>
                </div>

                <button
                  onClick={handleNext}
                  disabled={!formData.travelCircle}
                  className="w-full py-3 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  INICIAR TEST ADN
                </button>
              </motion.div>
            )}

            {/* Step 3: Preguntas psicométricas */}
            {step === 3 && (
              <motion.div
                key={`question-${currentQuestion}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-6">
                  <p className="text-gold-500 text-sm mb-2">ADN</p>
                  <p className="text-gray-400 text-sm mb-4">{QUESTIONS[currentQuestion].dimension}</p>
                  <h2 className="text-2xl font-bold text-white mb-8">
                    {QUESTIONS[currentQuestion].question}
                  </h2>
                </div>

                <div className="space-y-4">
                  {QUESTIONS[currentQuestion].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleQuestionAnswer(QUESTIONS[currentQuestion].id, option.value)}
                      className={`w-full p-6 rounded-2xl border-2 text-left transition-all ${
                        formData.answers[QUESTIONS[currentQuestion].id] === option.value
                          ? 'border-gold-500 bg-gold-500/20'
                          : 'border-white/20 bg-white/5 hover:border-white/40'
                      }`}
                    >
                      <p className="text-white font-bold text-lg mb-1">{option.label}</p>
                      <p className="text-gray-400 text-sm">{option.sublabel}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Selección final */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    DISEÑO <span className="text-gold-500">FINAL</span>
                  </h2>
                </div>

                {/* Slider de días */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-white">ESTADÍA</p>
                    <p className="text-gold-500 font-bold">{formData.days} Días</p>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
                </div>

                {/* Selección de destino */}
                <div className="mb-8">
                  <h3 className="text-white font-bold mb-4">SELECCIÓN DE DESTINO</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {DESTINATIONS.map((dest) => {
                      const Icon = dest.icon;
                      return (
                        <button
                          key={dest.id}
                          onClick={() => setFormData({ ...formData, destination: dest.id })}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                            formData.destination === dest.id
                              ? 'border-gold-500 bg-gold-500/20'
                              : dest.special
                              ? 'border-purple-500/50 bg-purple-500/10 hover:border-purple-500'
                              : 'border-white/20 bg-white/5 hover:border-white/40'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`w-5 h-5 ${dest.special ? 'text-purple-500' : 'text-gold-500'}`} />
                            <div>
                              <p className={`font-bold text-sm ${dest.special ? 'text-purple-400' : 'text-white'}`}>
                                {dest.name}
                              </p>
                              {dest.subtitle && (
                                <p className="text-xs text-gray-400">{dest.subtitle}</p>
                              )}
                            </div>
                          </div>
                          {formData.destination === dest.id && (
                            <Check className="w-5 h-5 text-gold-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón confirmar */}
                <button
                  onClick={handleComplete}
                  disabled={!formData.destination || loading}
                  className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-navy-900 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-navy-900"></div>
                      <span>PROCESANDO ADN...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>CONFIRMAR VIAJE</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-gold-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-gold-500 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-gold-500" />
            </div>
            <p className="text-white text-xl font-bold mb-2">PROCESANDO ADN...</p>
            <p className="text-gray-400 text-sm">DECODIFICANDO 5 DIMENSIONES</p>
            <p className="text-gray-500 text-xs mt-1">ALGORITMO GENERATIVO ACTIVO</p>
          </div>
        </div>
      )}
    </div>
  );
}
             
