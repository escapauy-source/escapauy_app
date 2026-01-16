import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Trash2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Service {
    id: string;
    title: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    active: boolean;
}

export default function PartnerServices() {
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        category: 'outdoor',
        imageFile: null as File | null
    });

    useEffect(() => {
        fetchServices();
    }, [user]);

    const fetchServices = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('partner_id', user.id);

            if (error) throw error;
            setServices(data || []);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, imageFile: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !formData.title || !formData.price || !formData.imageFile) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
        }

        setUploading(true);
        try {
            // 1. Upload Image
            const fileExt = formData.imageFile.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${user.id}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('service-images')
                .upload(filePath, formData.imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('service-images')
                .getPublicUrl(filePath);

            // 2. Insert Service
            const { error: insertError } = await supabase
                .from('services')
                .insert({
                    partner_id: user.id,
                    title: formData.title,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    category: formData.category,
                    image_url: publicUrl,
                    active: true
                });

            if (insertError) throw insertError;

            toast.success('Servicio creado exitosamente');
            setShowForm(false);
            setFormData({ title: '', description: '', price: '', category: 'outdoor', imageFile: null });
            fetchServices();

        } catch (error) {
            console.error('Error creating service:', error);
            toast.error('Error al crear el servicio');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;

        try {
            const { error } = await supabase
                .from('services')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success('Servicio eliminado');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Error al eliminar');
        }
    };

    if (loading) return <div className="text-center py-8 text-slate-400">Cargando servicios...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Mis Servicios</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus size={18} /> Nuevo Servicio
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-700 p-6 rounded-2xl space-y-4 animate-fade-in">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Título del Servicio</label>
                        <input
                            type="text"
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Tour de Vinos Premium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Descripción</label>
                        <textarea
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detalles sobre la experiencia..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Precio (UYU)</label>
                            <input
                                type="number"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Categoría</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="outdoor">Aire Libre</option>
                                <option value="indoor">Interior</option>
                                <option value="gastronomy">Gastronomía</option>
                                <option value="wellness">Bienestar</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Imagen Principal</label>
                        <div className="flex items-center gap-4">
                            <label className="cursor-pointer bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-300 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                                <ImageIcon size={18} />
                                {formData.imageFile ? 'Cambiar Imagen' : 'Subir Imagen'}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                            </label>
                            {formData.imageFile && <span className="text-xs text-emerald-400">{formData.imageFile.name}</span>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                        {uploading ? <Loader2 className="animate-spin" /> : 'Guardar Servicio'}
                    </button>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map(service => (
                    <div key={service.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex gap-4">
                        <div className="w-20 h-20 bg-slate-800 rounded-lg overflow-hidden shrink-0">
                            <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">{service.title}</h3>
                            <p className="text-sm text-slate-400 line-clamp-2">{service.description}</p>
                            <p className="text-emerald-400 font-bold mt-1">${service.price}</p>
                        </div>
                        <button
                            onClick={() => handleDelete(service.id)}
                            className="text-slate-500 hover:text-red-400 transition mb-auto"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>

            {services.length === 0 && !showForm && (
                <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl">
                    <p className="text-slate-500">No tienes servicios activos</p>
                </div>
            )}
        </div>
    );
}
