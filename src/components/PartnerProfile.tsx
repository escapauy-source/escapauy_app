import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

export default function PartnerProfile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        full_name: '',
        whatsapp: '',
        website: ''
    });

    useEffect(() => {
        if (user) getProfile();
    }, [user]);

    const getProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    whatsapp: data.whatsapp || '',
                    website: data.website || ''
                });
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setFetching(false);
        }
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 🧬 Ensure whatsapp contains country code
            const updates = {
                id: user?.id,
                full_name: formData.full_name,
                whatsapp: formData.whatsapp,
                website: formData.website,
                updated_at: new Date()
            };

            const { error } = await supabase.from('profiles').upsert(updates);
            if (error) throw error;
            toast.success('Perfil actualizado correctamente');
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="text-center text-slate-500 py-8">Cargando datos...</div>;

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                        {formData.full_name ? formData.full_name[0].toUpperCase() : 'P'}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Mi Perfil comercial</h2>
                        <p className="text-slate-400 text-sm">{user?.email}</p>
                    </div>
                </div>

                <form onSubmit={updateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Nombre del Establecimiento</label>
                        <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="Ej. Bodega Los Pinos"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">WhatsApp (con código de país)</label>
                        <input
                            type="text"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="+598 99 123 456"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Sitio Web (Opcional)</label>
                        <input
                            type="text"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Guardar Cambios</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
