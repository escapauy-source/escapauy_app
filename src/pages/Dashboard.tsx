import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase"; 
import { MapPin, Clock, Star, Shield, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data, error } = await supabase
          .from("trips")
          .select("*")
          .eq("status", "active");

        if (error || !data || data.length === 0) {
          // Datos de respaldo para que la página NUNCA se vea vacía
          setTrips([
            {
              id: '1',
              title: 'Experiencia Boutique Colina',
              location: 'Maldonado, UY',
              duration: 'Full Day',
              price: 150,
              description: 'Una cata exclusiva con los mejores licores y vistas panorámicas.',
              image_url: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80'
            },
            {
              id: '2',
              title: 'Escapada Romántica Gold',
              location: 'Punta del Este',
              duration: '2 Días',
              price: 450,
              description: 'Lujo y confort en la costa uruguaya con atención personalizada.',
              image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80'
            }
          ] );
        } else {
          setTrips(data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-20 font-sans">
      {/* Header con Dorado Boutique */}
      <header className="border-b border-[#C5A059]/40 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 border-2 border-[#C5A059] rotate-45 flex items-center justify-center">
              <span className="text-[#C5A059] font-bold -rotate-45">E</span>
            </div>
            <h1 className="text-2xl font-serif font-bold tracking-tighter bg-gradient-to-r from-[#C5A059] via-[#F5E6AD] to-[#C5A059] bg-clip-text text-transparent">
              ESCAPA UY
            </h1>
          </div>
          <button 
            className="px-5 py-2 rounded-full border border-[#C5A059] text-[#C5A059] hover:bg-[#C5A059] hover:text-black transition-all duration-500 text-sm font-bold tracking-widest uppercase"
            onClick={() => navigate("/my-bookings")}
          >
            Mis Reservas
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="mb-16 text-center">
          <h2 className="text-5xl font-serif font-bold mb-4 text-white">Descubre tu próxima aventura</h2>
          <div className="w-24 h-1 bg-[#C5A059] mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto italic">Experiencias exclusivas seleccionadas para los paladares más exigentes.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {trips.map((trip) => (
            <div 
              key={trip.id} 
              className="group relative bg-[#0A0A0A] border border-[#C5A059]/20 hover:border-[#C5A059]/60 transition-all duration-700 rounded-none overflow-hidden cursor-pointer"
              onClick={() => navigate(`/trip/${trip.id}`)}
            >
              {/* Imagen con Overlay Dorado */}
              <div className="relative h-72 overflow-hidden">
                <img src={trip.image_url} alt={trip.title} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md border border-[#C5A059]/50 px-4 py-1">
                  <span className="text-[#C5A059] font-serif text-xl font-bold">${trip.price}</span>
                </div>
              </div>

              {/* Contenido con Estilo Boutique */}
              <div className="p-8 border-t border-[#C5A059]/10">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-[#C5A059]" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059]">Experiencia Verificada</span>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4 group-hover:text-[#C5A059] transition-colors duration-500">{trip.title}</h3>
                
                <div className="flex items-center text-gray-500 text-xs mb-6 gap-6 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    {trip.location}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    {trip.duration}
                  </div>
                </div>

                <button className="w-full py-4 border border-[#C5A059]/30 bg-transparent group-hover:bg-[#C5A059] group-hover:text-black transition-all duration-500 text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                  Explorar Detalles <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
