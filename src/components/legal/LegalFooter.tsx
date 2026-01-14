import React from 'react';
import { Shield, Mail, Phone, MapPin, FileText, Lock, AlertCircle, ExternalLink } from 'lucide-react';

const LegalFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">
      
      {/* Sección Principal */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Columna 1: Sobre EscapaUY */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <h3 className="text-white font-bold text-lg">EscapaUY</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Plataforma de intermediación turística en Uruguay. Conectamos turistas con experiencias auténticas en Colonia.
            </p>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Juan Lacaze, Colonia, Uruguay</span>
            </div>
          </div>

          {/* Columna 2: Enlaces Legales */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a 
                  href="/terminos-y-condiciones" 
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Términos y Condiciones</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="/politica-de-privacidad" 
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <Lock className="w-4 h-4" />
                  <span>Política de Privacidad</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="/reclamos" 
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Canal de Reclamos</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="/cookies" 
                  className="hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span>Política de Cookies</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Contacto
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">General</p>
                  <a href="mailto:info@escapauy.com" className="hover:text-white transition-colors">
                    info@escapauy.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Reclamos</p>
                  <a href="mailto:reclamos@escapauy.com" className="hover:text-white transition-colors">
                    reclamos@escapauy.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Datos Personales</p>
                  <a href="mailto:datos@escapauy.com" className="hover:text-white transition-colors">
                    datos@escapauy.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Teléfono</p>
                  <a href="tel:+598XXXXXXXX" className="hover:text-white transition-colors">
                    +598 XXXX XXXX
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Columna 4: Cumplimiento Normativo */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Regulaciones
            </h3>
            <div className="space-y-4">
              
              {/* BCU */}
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <p className="text-xs font-semibold text-white">Banco Central del Uruguay</p>
                </div>
                <p className="text-xs text-gray-400">
                  Inscrito como Proveedor de Servicios de Pago y Cobranza (PSPC)
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Registro BCU: [N° XXXXX]
                </p>
              </div>

              {/* URCDP */}
              <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-xs font-semibold text-white">URCDP</p>
                </div>
                <p className="text-xs text-gray-400">
                  Base de datos inscrita ante la Unidad Reguladora y de Control de Datos Personales
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Registro URCDP: [N° XXXXX]
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Barra de Cumplimiento Legal */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Ley 17.250 - Defensa del Consumidor
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Ley 18.331 - Protección de Datos
              </span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Normativa BCU - Sistema de Pagos
              </span>
            </div>

            <div className="text-center md:text-right">
              <p>© 2026 EscapaUY S.A. - Todos los derechos reservados</p>
              <p className="text-gray-600 mt-1">RUT: [Número de RUT]</p>
            </div>

          </div>
        </div>
      </div>

      {/* Aviso de Responsabilidad Solidaria */}
      <div className="bg-amber-900/20 border-t border-amber-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200">
              <strong>Aviso Legal:</strong> EscapaUY actúa como intermediario profesional y es solidariamente responsable junto con el Partner por el cumplimiento del servicio contratado, conforme a la Ley 17.250 de Relaciones de Consumo.
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default LegalFooter;