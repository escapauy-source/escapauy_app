import React, { useState } from 'react';
import { Shield, AlertCircle, CheckCircle, X, Lock, User, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const DataConsentModal = ({ 
  isOpen = true, 
  onAccept, 
  onDecline,
  partnerName = "Bodega Boutique Carmelo",
  partnerRUT = "21 345 678 0012",
  partnerAddress = "Ruta 21 Km 262, Carmelo, Colonia",
  partnerPhone = "+598 4542 1234",
  serviceName = "Degustación de Vinos Premium con Almuerzo",
  serviceDate = "15 de Febrero, 2026",
  serviceTime = "12:30 hs"
}) => {
  const [hasReadDetails, setHasReadDetails] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (consentChecked) {
      onAccept && onAccept();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Consentimiento de Datos</h2>
                <p className="text-blue-100 text-sm mt-1">Protección según Ley 18.331</p>
              </div>
            </div>
            <button 
              onClick={onDecline}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Contenido con scroll */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Aviso Principal */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">¿Por qué necesitamos su consentimiento?</h3>
                <p className="text-sm text-blue-800">
                  Para que pueda disfrutar del servicio reservado, necesitamos compartir algunos de sus datos personales con el prestador del servicio. La Ley 18.331 nos obliga a informarle exactamente qué datos compartiremos y con quién.
                </p>
              </div>
            </div>
          </div>

          {/* Información del Servicio */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Servicio Reservado
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Experiencia:</span>
                <span className="font-medium text-gray-900">{serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium text-gray-900">{serviceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Horario:</span>
                <span className="font-medium text-gray-900">{serviceTime}</span>
              </div>
            </div>
          </div>

          {/* Información del Partner */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-purple-600" />
              Destinatario de sus Datos
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">Nombre Comercial</p>
                <p className="font-semibold text-gray-900">{partnerName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">RUT</p>
                  <p className="font-mono text-sm text-gray-900">{partnerRUT}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Teléfono</p>
                  <p className="text-sm text-gray-900">{partnerPhone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Dirección</p>
                <p className="text-sm text-gray-900">{partnerAddress}</p>
              </div>
            </div>
          </div>

          {/* Datos que se Compartirán */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              Datos que Compartiremos
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Nombre completo</p>
                  <p className="text-xs text-gray-600">Para identificarlo al momento de su llegada</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Últimos 4 dígitos del documento</p>
                  <p className="text-xs text-gray-600">Para validar su identidad de forma segura</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Código QR del voucher</p>
                  <p className="text-xs text-gray-600">Para validar su reserva confirmada</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 text-sm">Horario y cantidad de personas</p>
                  <p className="text-xs text-gray-600">Para preparar adecuadamente su experiencia</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <Shield className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-600" />
                <span>
                  <strong>Garantía:</strong> NO compartiremos su email, teléfono, dirección completa, ni datos de pago. Solo los datos mínimos necesarios para ejecutar el servicio.
                </span>
              </p>
            </div>
          </div>

          {/* Detalles Legales (Acordeón) */}
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => {
                setShowDetails(!showDetails);
                if (!showDetails) setHasReadDetails(true);
              }}
              className="w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between text-left"
            >
              <span className="font-semibold text-gray-900 text-sm">
                Información Legal Detallada
              </span>
              {showDetails ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>
            
            {showDetails && (
              <div className="px-4 py-4 bg-white text-sm text-gray-700 space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Base Legal</h4>
                  <p className="text-xs">
                    La comunicación de sus datos al Partner se fundamenta en: (1) Consentimiento expreso del titular (Art. 8, Ley 18.331), y (2) Ejecución del contrato de servicio turístico (Art. 9, Ley 18.331).
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Finalidad Exclusiva</h4>
                  <p className="text-xs">
                    Los datos compartidos serán utilizados ÚNICAMENTE para: validar su reserva, prepararle el servicio contratado, y registrar su asistencia. El Partner NO puede usar estos datos para otros fines (marketing, publicidad, etc.) sin su consentimiento adicional.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Sus Derechos</h4>
                  <p className="text-xs mb-2">
                    Usted puede ejercer sus derechos ARCO (Acceso, Rectificación, Cancelación, Oposición) tanto ante EscapaUY como ante el Partner:
                  </p>
                  <ul className="text-xs space-y-1 ml-4">
                    <li>• Solicitar qué datos tiene el Partner sobre usted</li>
                    <li>• Corregir datos inexactos</li>
                    <li>• Solicitar eliminación una vez finalizado el servicio</li>
                    <li>• Oponerse a usos no autorizados</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Responsabilidad de EscapaUY</h4>
                  <p className="text-xs">
                    EscapaUY es solidariamente responsable del tratamiento que el Partner haga de sus datos. Si el Partner hace un uso indebido, puede reclamarnos directamente a: datos@escapauy.com
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conservación de Datos</h4>
                  <p className="text-xs">
                    El Partner debe eliminar o anonimizar sus datos personales una vez cumplida la finalidad (después de prestar el servicio), salvo obligaciones legales de conservación (fiscales, contables).
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <p className="text-xs text-purple-900">
                    <strong>Autoridad de Control:</strong> Si considera que sus derechos han sido vulnerados, puede contactar a la URCDP: urcdp@agesic.gub.uy | +598 2901 2929
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Checkbox de Consentimiento */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              />
              <span className="text-sm text-gray-900 leading-relaxed">
                <strong className="text-purple-900">Consiento expresamente</strong> que EscapaUY comunique mis datos personales (nombre, últimos 4 dígitos de documento, código QR, horario y cantidad de personas) a <strong>{partnerName}</strong> (RUT: {partnerRUT}) para la ejecución del servicio turístico contratado. He leído y comprendo la información proporcionada sobre el tratamiento de mis datos.
              </span>
            </label>
          </div>

          {/* Aviso si no leyó detalles */}
          {!hasReadDetails && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  <strong>Recomendación:</strong> Le sugerimos leer la "Información Legal Detallada" antes de dar su consentimiento.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer con Botones */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onDecline}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancelar Reserva
            </button>
            <button
              onClick={handleAccept}
              disabled={!consentChecked}
              className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                consentChecked
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Acepto y Continuar
            </button>
          </div>
          
          <p className="text-xs text-gray-600 text-center mt-3">
            Al aceptar, confirma que ha leído nuestra <a href="/politica-de-privacidad" className="text-purple-600 hover:underline">Política de Privacidad</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default DataConsentModal;