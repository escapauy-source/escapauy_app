import { Mail, Phone, MapPin, AlertCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ComplaintsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bookingId: '',
    complaintType: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí integrarás con tu backend o EmailJS
    console.log('Reclamo enviado:', formData);
    toast.success('Reclamo enviado correctamente. Te responderemos en 10 días hábiles.');
    
    // Resetear formulario
    setFormData({
      name: '',
      email: '',
      phone: '',
      bookingId: '',
      complaintType: '',
      description: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-10 h-10" />
              <h1 className="text-3xl font-bold">Canal de Reclamos</h1>
            </div>
            <p className="text-orange-100">
              Estamos comprometidos con tu satisfacción. Si tienes alguna queja o reclamo, contáctanos.
            </p>
          </div>

          {/* Aviso Legal */}
          <div className="px-8 py-6 bg-amber-50 border-l-4 border-amber-500">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Responsabilidad Solidaria</h3>
                <p className="text-sm text-amber-800">
                  Conforme a la Ley 17.250, EscapaUY es solidariamente responsable junto con el Partner por el cumplimiento del servicio. Puedes reclamar directamente a nosotros ante cualquier incumplimiento.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Formulario */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Formulario de Reclamo</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Datos Personales */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Tus Datos</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="tu@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="+598 XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Reclamo */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Detalles del Reclamo</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Reserva (si aplica)
                    </label>
                    <input
                      type="text"
                      name="bookingId"
                      value={formData.bookingId}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Ej: TRIP-12345"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Reclamo *
                    </label>
                    <select
                      name="complaintType"
                      value={formData.complaintType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Selecciona una opción</option>
                      <option value="cancelacion">Cancelación del servicio</option>
                      <option value="mala-prestacion">Mala prestación del servicio</option>
                      <option value="diferencia-precio">Diferencia de precio</option>
                      <option value="reembolso">Solicitud de reembolso</option>
                      <option value="atencion">Atención al cliente</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del Reclamo *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Describe detalladamente tu reclamo: qué ocurrió, cuándo, y qué solución esperas..."
                    />
                  </div>
                </div>

                {/* Botón */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-orange-700 hover:to-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Enviar Reclamo
                </button>

                <p className="text-xs text-gray-600 text-center">
                  Responderemos tu reclamo en un plazo máximo de <strong>10 días hábiles</strong> conforme a la Ley 17.250
                </p>
              </form>
            </div>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-6">
            
            {/* Contacto Directo */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">Contacto Directo</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <a href="mailto:reclamos@escapauy.com" className="text-sm text-orange-600 hover:underline">
                      reclamos@escapauy.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Teléfono</p>
                    <a href="tel:+598XXXXXXXX" className="text-sm text-orange-600 hover:underline">
                      +598 XXXX XXXX
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Dirección</p>
                    <p className="text-sm text-gray-600">
                      Juan Lacaze<br />
                      Colonia, Uruguay
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Horario */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
              <h3 className="font-bold text-gray-900 mb-3">Horario de Atención</h3>
              <p className="text-sm text-gray-700">
                Lunes a Viernes<br />
                <strong>9:00 - 18:00 hrs</strong>
              </p>
            </div>

            {/* Defensa del Consumidor */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">Defensa del Consumidor</h3>
              <p className="text-xs text-gray-700 mb-3">
                Si tu reclamo no es resuelto satisfactoriamente, puedes contactar a:
              </p>
              <div className="space-y-2 text-xs">
                <p><strong>ADECU</strong></p>
                <p>Tel: 0800 9090</p>
                <p>www.gub.uy/ministerio-economia-finanzas/adecu</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}