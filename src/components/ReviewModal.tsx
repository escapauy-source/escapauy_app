import { useState } from 'react';
import { X, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId: string;
  serviceName: string;
  tripId: string;
}

export default function ReviewModal({ isOpen, onClose, serviceId, serviceName, tripId }: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([{
          service_id: serviceId,
          user_id: user?.id,
          trip_id: tripId,
          rating: rating,
          comment: comment,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('¡Gracias por tu reseña!');
      onClose();
      setRating(0);
      setComment('');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error('Error al enviar reseña');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Califica tu experiencia</h2>
        <p className="text-sm text-slate-600 mb-6">{serviceName}</p>

        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={32}
                className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}
              />
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos sobre tu experiencia (opcional)"
          className="w-full border border-slate-200 rounded-xl p-4 mb-4 outline-none focus:border-primary resize-none"
          rows={4}
        />

        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Enviando...' : 'Enviar Reseña'}
        </button>
      </div>
    </div>
  );
}