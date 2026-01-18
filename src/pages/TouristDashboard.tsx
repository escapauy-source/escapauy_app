import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  User,
  Users,
  Baby,
  Sparkles,
  ShieldCheck,
  Zap,
  Calendar,
  MapPin,
  BrainCircuit,
  Heart,
  Compass,
  Clock,
  Lock,
} from 'lucide-react';
import { toast } from 'sonner';

// --- CONSTANTS & HELPERS ---
const NATIONALITIES = [
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
  { code: 'OTHER', name: 'Internacional', flag: '🌎' },
];

const COLONIA_DESTINATIONS = [
  'Colonia del Sacramento',
  'Carmelo',
  'Nueva Helvecia',
  'Conchillas',
  'Colonia Valdense',
  'Tarariras',
  'Juan Lacaze',
  'Rosario',
  'Santa Ana',
  'Artilleros',
  'Costa del Inmigrante',
];

// Icon helpers for Stability (manually)
const Umbrella = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
  </svg>
);

const UmbrellaOff = ({ size }: { size: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 12v-7" />
    <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
  </svg>
);

// PSYCHOMETRIC DNA TEST (5 DIMENSIONS)
const DNA_QUESTIONS = [
  {
    trait: 'extraversion',
    label: 'Energía Social',
    icon: <Zap size={24} />,
    question: '¿Cuál es tu ambiente ideal?',
    options: [
      { label: 'Parador Social', sub: 'Música · Gente', value: 1, icon: <Users size={32} /> },
      { label: 'Rincón Zen', sub: 'Silencio · Río', value: 0, icon: <User size={32} /> },
    ],
  },
  {
    trait: 'conscientiousness',
    label: 'Estructura',
    icon: <Clock size={24} />,
    question: '¿Cómo manejas el tiempo?',
    options: [
      { label: 'Agenda Milimétrica', sub: 'Control Total', value: 1, icon: <Calendar size={32} /> },
      { label: 'Sorpresa Espontánea', sub: 'Flirteo con el Caos', value: 0, icon: <Compass size={32} /> },
    ],
  },
  {
    trait: 'openness',
    label: 'Apertura',
    icon: <Globe size={24} />,
    question: '¿Qué buscas descubrir?',
    options: [
      { label: 'Tesoros Ocultos', sub: 'Aventura Real', value: 1, icon: <MapPin size={32} /> },
      { label: 'Clásicos Probados', sub: 'Tradición Segura', value: 0, icon: <ShieldCheck size={32} /> },
    ],
  },
  {
    trait: 'agreeableness',
    label: 'Interacción',
    icon: <Heart size={24} />,
    question: 'Tu estilo de servicio?',
    options: [
      { label: 'Comunidad', sub: 'Experiencia Compartida', value: 1, icon: <Users size={32} /> },
      { label: 'Boutique', sub: 'Privado · Exclusivo', value: 0, icon: <Sparkles size={32} /> },
    ],
  },
  {
    trait: 'stability',
    label: 'Resiliencia',
    icon: <Lock size={24} />,
    question: '¿Y si llueve?',
    options: [
      { label: 'Adaptación Total', sub: 'Bailar bajo la lluvia', value: 1, icon: <UmbrellaOff size={32} /> },
      { label: 'Garantía Plan B', sub: 'Seguridad ante todo', value: 0, icon: <Umbrella size={32} /> },
    ],
  },
];

export default function TouristWizard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    nationality: '',
    companion: '',
    duration: 2,
    destination: '',
  });
  const [scores, setScores] = useState<Record<string, number>>({});

  const totalSteps = 6;

  // Clean slate on mount
  useEffect(() => {
    localStorage.removeItem('wizardcompleted');
  }, []);
  const handleIdentitySubmit = () => {
    if (!formData.fullname || !formData.nationality) {
      toast.error('Datos requeridos para beneficios fiscales.');
      return;
    }
    setStep(1);
  };

  const handleGroupSelect = (type: string) => {
    setFormData((prev) => ({ ...prev, companion: type }));
  };

  const handleGroupSubmit = () => {
    if (!formData.companion) {
      toast.error('Selecciona tu compañía de viaje.');
      return;
    }
    setStep(2);
  };

  const handleDnaAnswer = (trait: string, value: number) => {
    setScores((prev) => ({ ...prev, [trait]: value }));
    if (step < 6) {
      setStep((prev) => prev + 1);
    } else {
      setStep(7);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      window.history.back();
    }
  };

  // FUNCIÓN MEJORADA SEGÚN SUGERENCIA
  const handleCompleteWizard = async () => {
    if (!formData.destination) {
      toast.error('Selecciona un destino o la opción IA.');
      return;
    }

    setLoading(true);
    setStep(8); // Mostrar pantalla de loading

    try {
      // 1. VERIFICAR SESIÓN ACTIVA
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        navigate('/login');
        return;
      }

      // 2. PREPARAR DATOS
      const isAI = formData.destination === 'AI_ROUTE';
      const isVATFree = formData.nationality !== 'UY';
      let tag = 'DESTINY_SEEKER';
      if (formData.companion === 'SOLO') tag = 'SOLO_EXPLORER';
      if (formData.companion === 'COUPLE') tag = 'ROMANTIC_DUO';
      if (formData.companion === 'FAMILY') tag = 'FAMILY_TRIBE';
      if (formData.companion === 'FRIENDS') tag = 'SQUAD_GOALS';

      // 3. GUARDAR PERFIL PSICOMÁTRICO (UPSERT)
      const { data: profileData, error: profileError } = await supabase
        .from('psychometric_profiles')
        .upsert(
          {
            userid: session.user.id,
            openness: scores.openness ?? 0,
            conscientiousness: scores.conscientiousness ?? 0,
            extraversion: scores.extraversion ?? 0,
            agreeableness: scores.agreeableness ?? 0,
            stability: scores.stability ?? 0,
            companiontype: formData.companion,
            tripduration: formData.duration,
            travelertag: tag,
            isvatfree: isVATFree,
            iainsight: JSON.stringify({
              fullname: formData.fullname,
              nationality: formData.nationality,
              destinationpreference: formData.destination,
              generatedbyai: isAI,
              dnasnapshot: scores,
            }),
            updatedat: new Date().toISOString(),
          },
          { onConflict: 'userid' }
        )
        .select();

      if (profileError) {
        console.error('Error guardando perfil:', profileError);
        toast.error(`Error al guardar perfil: ${profileError.message}`);
        setLoading(false);
        setStep(7); // Volver al paso anterior
        return;
      }

      console.log('Perfil psicomátrico guardado:', profileData);

      // 4. CREAR TRIP BÁSICO
      const { data: tripData, error: tripError } = await supabase
        .from('trips')
        .insert({
          userid: session.user.id,
          status: 'confirmed',
          name: `Escapada ${formData.destination === 'AI_ROUTE' ? 'Sorpresa IA' : formData.destination}`,
          iainsight: JSON.stringify({
            fullname: formData.fullname,
            dnaprofile: scores,
            destination: formData.destination,
            companion: formData.companion,
            duration: formData.duration,
          }),
        })
        .select();

      if (tripError) {
        console.error('Error creando trip (no crítico):', tripError);
        // No bloqueamos el flujo si falla el trip
      } else {
        console.log('Trip creado:', tripData);
      }

      // 5. ÉXITO
      toast.success('¡Perfil ADN guardado exitosamente!');
      localStorage.setItem('wizardcompleted', 'true');
      setTimeout(() => navigate('/my-bookings'), 1500);
    } catch (error: any) {
      console.error('Error inesperado:', error);
      toast.error(`Error inesperado: ${error.message}. Intenta de nuevo.`);
      setLoading(false);
      setStep(7); // Volver al paso anterior
      return;
    }
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden flex items-center justify-center">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80"
          className="w-full h-full object-cover opacity-20 blur-30px scale-105"
          alt="Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950" />
      </div>

      <main className="relative z-10 w-full max-w-4xl px-8 py-10 font-heading flex flex-col items-center">
        {/* BACK BUTTON */}
        {step !== 8 && (
          <button
            onClick={handleBack}
            className="absolute top-0 left-8 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all backdrop-blur-md z-50 flex items-center gap-2 group"
          >
            <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Atrás</span>
          </button>
        )}

        <AnimatePresence mode="wait">
          {/* PASO 1: IDENTIDAD */}
          {step === 0 && (
            <motion.div
              key="identity"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-morphism p-12 rounded-3rem border-white/5 bg-white/0.02 text-center w-full max-w-2xl"
            >
              <div className="mb-10">
                <span className="text-gold-boutique font-mono font-black text-10px uppercase tracking-0.4em bg-gold-boutique/10 px-4 py-2 rounded-full border border-gold-boutique/20">
                  Paso 1/4
                </span>
                <h1 className="text-5xl font-black uppercase tracking-tighter mt-6 mb-2 text-white">
                  Identidad <span className="text-gold-boutique italic font-serif">Fiscal</span>
                </h1>
                <p className="text-white/30 text-xs tracking-widest uppercase">Validación Ley 19.210</p>
              </div>

              <div className="space-y-6 text-left mb-10">
                <div className="space-y-3">
                  <label className="text-10px font-black uppercase tracking-0.2em text-white/40 ml-4">Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.fullname}
                    onChange={(e) => setFormData({ ...formData, fullname: e.target.value.toUpperCase() })}
                    className="w-full bg-black/40 border border-white/10 rounded-1.5rem px-6 py-5 focus:border-gold-boutique focus:ring-1 focus:ring-gold-boutique transition-all outline-none font-bold tracking-wider placeholder:text-white/10"
                    placeholder="TU NOMBRE..."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-10px font-black uppercase tracking-0.2em text-white/40 ml-4">Residencia Fiscal</label>
                  <select
                    value={formData.nationality}
                    onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-1.5rem px-6 py-5 focus:border-gold-boutique outline-none appearance-none font-bold tracking-wider"
                  >
                    <option value="" disabled className="bg-slate-900">
                      SELECCIONAR PAÍS...
                    </option>
                    {NATIONALITIES.map((n) => (
                      <option key={n.code} value={n.code} className="bg-slate-900">
                        {n.flag} {n.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleIdentitySubmit}
                className="w-full bg-gold-boutique text-black font-black py-6 rounded-1.5rem hover:scale-1.02 active:scale-95 transition-all uppercase tracking-0.3em text-xs flex items-center justify-center gap-3 shadow-lg shadow-gold-boutique/20"
              >
                Siguiente <ArrowRight size={16} />
              </button>
            </motion.div>
          )}
          {/* PASO 2: COMPAÑÍA */}
          {step === 1 && (
            <motion.div
              key="companion"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-morphism p-12 rounded-3rem border-white/5 bg-white/0.02 text-center w-full max-w-3xl"
            >
              <div className="mb-10">
                <span className="text-gold-boutique font-mono font-black text-10px uppercase tracking-0.4em bg-gold-boutique/10 px-4 py-2 rounded-full border border-gold-boutique/20">
                  Paso 2/4
                </span>
                <h1 className="text-5xl font-black uppercase tracking-tighter mt-6 mb-2 text-white">
                  Tu <span className="text-gold-boutique italic font-serif">Círculo</span>
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { id: 'SOLO', label: 'Solo', icon: <User size={32} /> },
                  {
                    id: 'COUPLE',
                    label: 'Pareja',
                    icon: (
                      <div className="flex">
                        <User size={28} />
                        <User size={28} className="-ml-3 text-gold-boutique" />
                      </div>
                    ),
                  },
                  {
                    id: 'FAMILY',
                    label: 'Familia',
                    icon: (
                      <div className="flex items-end">
                        <User size={24} />
                        <User size={28} className="-ml-2" />
                        <Baby size={20} className="-ml-1" />
                      </div>
                    ),
                  },
                  { id: 'FRIENDS', label: 'Amigos', icon: <Users size={32} /> },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleGroupSelect(opt.id)}
                    className={`p-6 rounded-2rem border transition-all flex flex-col items-center justify-center gap-3 group ${
                      formData.companion === opt.id
                        ? 'bg-gold-boutique border-gold-boutique text-black shadow-xl'
                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="mb-1 group-hover:scale-110 transition-transform duration-300">{opt.icon}</div>
                    <span className="block font-black text-sm uppercase tracking-wider">{opt.label}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={handleGroupSubmit}
                className="w-full bg-white text-black font-black py-6 rounded-1.5rem hover:scale-1.02 active:scale-95 transition-all uppercase tracking-0.3em text-xs flex items-center justify-center gap-3 shadow-lg"
              >
                Iniciar Test ADN <BrainCircuit size={16} />
              </button>
            </motion.div>
          )}

          {/* PASO 3-6: DNA TEST */}
          {step >= 2 && step <= 6 && (
            <motion.div
              key="dna-step"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-morphism p-12 md:p-16 rounded-3rem border-white/5 bg-white/0.02 text-center w-full max-w-4xl"
            >
              <div className="mb-12">
                <span className="text-gold-boutique font-mono font-black text-10px uppercase tracking-0.4em bg-gold-boutique/10 px-4 py-2 rounded-full border border-gold-boutique/20">
                  ADN · {DNA_QUESTIONS[step - 2].label}
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mt-6 mb-8 text-white leading-tight">
                  {DNA_QUESTIONS[step - 2].question}
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {DNA_QUESTIONS[step - 2].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDnaAnswer(DNA_QUESTIONS[step - 2].trait, opt.value)}
                    className="h-64 rounded-2.5rem border border-white/10 bg-white/5 hover:bg-gold-boutique hover:border-gold-boutique hover:text-black transition-all group flex flex-col items-center justify-center gap-6 relative overflow-hidden"
                  >
                    <div className="scale-125 group-hover:scale-110 transition-transform text-white/50 group-hover:text-black">{opt.icon}</div>
                    <div className="relative z-10">
                      <span className="block text-2xl font-black uppercase tracking-tighter mb-1">{opt.label}</span>
                      <span className="block text-xs font-mono uppercase tracking-widest opacity-50 group-hover:opacity-100">{opt.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          {/* PASO 7: LOGISTICS */}
          {step === 7 && (
            <motion.div
              key="logistics"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="glass-morphism p-8 md:p-12 rounded-3.5rem border-white/5 bg-white/0.02 text-center w-full max-w-4xl h-[85vh] flex flex-col"
            >
              <div className="flex-shrink-0 mb-6">
                <span className="text-gold-boutique font-mono font-black text-10px uppercase tracking-0.4em bg-gold-boutique/10 px-4 py-2 rounded-full border border-gold-boutique/20">
                  Paso 4/4
                </span>
                <h1 className="text-4xl font-black uppercase tracking-tighter mt-4 text-white">
                  Diseño <span className="text-gold-boutique italic font-serif">Final</span>
                </h1>
              </div>

              <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar space-y-8">
                {/* DURATION */}
                <div className="space-y-4 px-4">
                  <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <label className="text-xs font-black uppercase tracking-widest text-white/50">Estadía</label>
                    <span className="text-2xl font-black text-gold-boutique">{formData.duration} Días</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full accent-gold-boutique h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                  />
                </div>

                {/* DESTINATIONS */}
                <div className="space-y-4 text-left">
                  <h3 className="text-xs font-black uppercase tracking-0.2em text-white/30 ml-2">Selección de Destino</h3>

                  {/* AI OPTION */}
                  <button
                    onClick={() => setFormData({ ...formData, destination: 'AI_ROUTE' })}
                    className={`w-full p-6 rounded-2rem border transition-all flex items-center justify-between group relative overflow-hidden ${
                      formData.destination === 'AI_ROUTE'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-900 border-violet-400/50 text-white'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div className="absolute inset-0 bg-url('https://www.transparenttextures.com/patterns/stardust.png') opacity-20 animate-pulse" />
                    <div className="flex items-center gap-5 relative z-10">
                      <div className={`p-4 rounded-full ${formData.destination === 'AI_ROUTE' ? 'bg-white/20' : 'bg-slate-950'}`}>
                        <BrainCircuit
                          size={24}
                          className={formData.destination === 'AI_ROUTE' ? 'text-white animate-spin-slow' : 'text-violet-400'}
                        />
                      </div>
                      <div className="text-left">
                        <h3 className="font-black text-lg uppercase tracking-wider">Diseña mi ruta según mi ADN</h3>
                        <p className="text-10px opacity-70 font-mono mt-1">Algoritmo Genéticamente Personalizado</p>
                      </div>
                    </div>
                    {formData.destination === 'AI_ROUTE' && <CheckCircle2 className="text-emerald-400" />}
                  </button>

                  {/* LIST */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {COLONIA_DESTINATIONS.map((dest) => (
                      <button
                        key={dest}
                        onClick={() => setFormData({ ...formData, destination: dest })}
                        className={`p-4 rounded-1.5rem border text-left transition-all flex items-center justify-between ${
                          formData.destination === dest
                            ? 'bg-gold-boutique border-gold-boutique text-black font-bold shadow-lg'
                            : 'bg-black/20 border-white/5 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-xs uppercase tracking-wide leading-tight">{dest}</span>
                        {formData.destination === dest && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 pt-4 border-t border-white/5">
                <button
                  onClick={handleCompleteWizard}
                  disabled={!formData.destination || loading}
                  className="w-full bg-gradient-to-r from-gold-boutique to-[#C5A059] text-black font-black py-7 rounded-2rem hover:scale-1.01 active:scale-95 transition-all shadow-2xl shadow-gold-boutique/10 uppercase tracking-0.4em text-xs flex items-center justify-center gap-4 group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? 'Procesando...' : 'Confirmar Viaje'} <Zap size={18} className="group-hover:text-white transition-colors" />
                </button>
              </div>
            </motion.div>
          )}
          {/* PASO 8: PROCESSING */}
          {step === 8 && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-black/50 p-12 rounded-3rem border border-gold-boutique/20"
            >
              <div className="relative w-32 h-32 mx-auto mb-10">
                <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                <motion.div
                  className="absolute inset-0 border-4 border-t-gold-boutique rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <BrainCircuit className="absolute inset-0 m-auto text-gold-boutique" size={40} />
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Procesando ADN...</h2>
              <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-1">Decodificando 5 Dimensiones</p>
              <p className="text-emerald-400 text-10px font-mono uppercase tracking-widest animate-pulse">
                {formData.destination === 'AI_ROUTE'
                  ? '✨ Algoritmo Generativo Activo'
                  : `Validando disponibilidad en ${formData.destination}`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
