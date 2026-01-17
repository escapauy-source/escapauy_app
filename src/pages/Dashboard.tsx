import { useEffect, useState } from "react";
// RUTA REAL: sale de pages, entra en lib
import { supabase } from "../lib/supabase"; 
// RUTAS REALES: los componentes están directamente en components
import { Button } from "../components/Button";
import { MapPin, Clock } from "lucide-react";
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

        if (error) throw error;
        setTrips(data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A059]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20">
      <header className="border-b border-[#C5A059]/30 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-[#C5A059] to-yellow-200 bg-clip-text text-transparent">
            EscapaUY
          </h1>
          <Button className="text-[#C5A059] border-[#C5A059] hover:bg-[#C5A059]/20" onClick={() => navigate("/my-bookings")}>
            Mis Reservas
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-2">Descubre tu próxima aventura</h2>
          <p className="text-slate-400 mb-8">Experiencias exclusivas seleccionadas para ti</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-slate-900 border border-[#C5A059]/20 hover:border-[#C5A059]/50 transition-all duration-300 rounded-xl overflow-hidden group cursor-pointer" onClick={() => navigate(`/trip/${trip.id}`)}>
                <div className="relative h-48 overflow-hidden">
                  <img src={trip.image_url || "/placeholder.svg"} alt={trip.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#C5A059]/30">
                    <span className="text-[#C5A059] font-bold">${trip.price}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[#C5A059] transition-colors">{trip.title}</h3>
                  <div className="flex items-center text-slate-400 text-sm mb-4 gap-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[#C5A059]" />
                      {trip.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-[#C5A059]" />
                      {trip.duration}
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-6">{trip.description}</p>
                  <Button className="w-full bg-[#C5A059] hover:bg-[#C5A059]/80 text-slate-950 font-bold">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
