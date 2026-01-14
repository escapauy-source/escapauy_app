import React, { useState } from 'react';
import { Lock, Database, Eye, Shield, UserCheck, Bell, ChevronDown, ChevronUp, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Section = ({ id, title, icon: Icon, children }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">{title}</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-600" />
          )}
        </button>
        {isExpanded && (
          <div className="px-6 py-4 bg-white text-gray-700 leading-relaxed">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Política de Privacidad</h1>
          </div>
          <p className="text-purple-100 text-lg">
            Protección de Datos Personales - Ley 18.331
          </p>
          <p className="text-purple-200 text-sm mt-2">
            Última actualización: Enero 2026
          </p>
        </div>

        <div className="px-8 py-6 bg-blue-50 border-l-4 border-blue-500">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Nuestro Compromiso</h3>
              <p className="text-blue-800 text-sm">
                EscapaUY protege su privacidad conforme a la Ley 18.331 de Protección de Datos Personales y Acción de Habeas Data de Uruguay. Nuestra base de datos está inscrita ante la Unidad Reguladora y de Control de Datos Personales (URCDP).
              </p>
            </div>
          </div>
        </div>

        <div className="px-8 py-8">
          
          <Section id="1" title="1. Responsable de la Base de Datos" icon={Database}>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-3">Información del Responsable:</p>
              <ul className="space-y-2 text-sm">
                <li><strong>Razón Social:</strong> EscapaUY S.A.</li>
                <li><strong>RUT:</strong> [Número de RUT]</li>
                <li><strong>Domicilio:</strong> [Dirección completa], Juan Lacaze, Colonia, Uruguay</li>
                <li><strong>Email de Contacto:</strong> datos@escapauy.com</li>
                <li><strong>Teléfono:</strong> +598 XXXX XXXX</li>
                <li><strong>Inscripción URCDP:</strong> [Número de inscripción]</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600">
              Conforme al Art. 11 de la Ley 18.331, el responsable de la base de datos debe estar claramente identificado para que los titulares puedan ejercer sus derechos.
            </p>
          </Section>

          <Section id="2" title="2. Datos Personales que Recolectamos" icon={Database}>
            <p className="mb-4">
              Para brindar nuestros servicios de intermediación turística, recolectamos los siguientes datos personales:
            </p>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">A. Datos de Identificación (Obligatorios)</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Nombre completo</li>
                  <li>Documento de identidad (CI, pasaporte)</li>
                  <li>Fecha de nacimiento</li>
                  <li>Nacionalidad</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Finalidad:</strong> Cumplimiento de obligaciones legales de identificación de usuarios (KYC) conforme a normativa BCU de prevención de lavado de activos.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">B. Datos de Contacto (Obligatorios)</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Dirección de email</li>
                  <li>Número de teléfono móvil</li>
                  <li>País de residencia</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Finalidad:</strong> Comunicaciones relacionadas con reservas, envío de vouchers, notificaciones de cambios (activación Plan B climático), y atención de consultas.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">C. Datos de Preferencias y Perfil (Opcionales)</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Perfil psicológico basado en Big Five</li>
                  <li>Preferencias de actividades turísticas</li>
                  <li>Restricciones alimentarias o de movilidad</li>
                  <li>Idiomas de preferencia</li>
                </ul>
                <p className="text-xs text-gray-600 mt-2">
                  <strong>Finalidad:</strong> Personalización de recomendaciones mediante inteligencia artificial para mejorar la experiencia del usuario.
                </p>
              </div>
            </div>
          </Section>

          <Section id="3" title="3. Finalidad del Tratamiento de Datos" icon={Eye}>
            <p className="mb-4">
              Sus datos personales son tratados exclusivamente para las siguientes finalidades legítimas:
            </p>
            
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Finalidades Principales</h4>
                <ul className="list-disc pl-6 space-y-2 text-sm text-blue-800">
                  <li><strong>Gestión de Reservas:</strong> Procesar, confirmar y gestionar sus reservas de experiencias turísticas</li>
                  <li><strong>Emisión de Vouchers:</strong> Generar vouchers digitales con código QR para validación ante el Partner</li>
                  <li><strong>Coordinación con Partners:</strong> Comunicar información necesaria para ejecutar el servicio</li>
                  <li><strong>Sistema de Pagos:</strong> Procesar la seña y gestionar transferencias conforme a normativa BCU</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="4" title="4. Comunicación de Datos a Terceros" icon={UserCheck}>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-red-900 mb-2">Consentimiento Requerido</h4>
              <p className="text-red-800 text-sm">
                Al confirmar una reserva, usted consiente expresamente que EscapaUY comunique sus datos personales al Partner específico para la ejecución del servicio contratado.
              </p>
            </div>

            <p className="mb-4">
              <strong>Destinatarios de sus datos:</strong>
            </p>

            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">A. Partners (Prestadores de Servicios)</h4>
                <p className="text-sm mb-2">
                  <strong>Datos compartidos:</strong> Nombre completo, documento de identidad (últimos 4 dígitos), horario confirmado, cantidad de personas, código QR del voucher.
                </p>
                <p className="text-sm mb-2">
                  <strong>Finalidad:</strong> Permitir la ejecución del servicio turístico contratado y validación del voucher.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">B. Pasarela de Pagos</h4>
                <p className="text-sm mb-2">
                  <strong>Datos compartidos:</strong> Nombre, email, monto de transacción. La pasarela procesa directamente los datos de tarjeta sin que EscapaUY tenga acceso a ellos.
                </p>
              </div>
            </div>
          </Section>

          <Section id="5" title="5. Protección y Seguridad de los Datos" icon={Shield}>
            <p className="mb-4">
              EscapaUY implementa medidas técnicas y organizativas para proteger sus datos personales:
            </p>

            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Medidas Técnicas</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm text-blue-800">
                  <li><strong>Encriptación:</strong> Protocolo HTTPS (TLS 1.3) para toda la comunicación</li>
                  <li><strong>Cifrado de Datos:</strong> Base de datos encriptada en reposo (AES-256)</li>
                  <li><strong>Certificación PCI DSS:</strong> Cumplimiento de estándares de seguridad para datos de pago</li>
                  <li><strong>Firewalls:</strong> Protección perimetral contra accesos no autorizados</li>
                </ul>
              </div>
            </div>
          </Section>

          <Section id="6" title="6. Derechos del Titular de Datos (ARCO)" icon={UserCheck}>
            <p className="mb-4">
              Como titular de datos personales, usted tiene los siguientes derechos conforme a la Ley 18.331:
            </p>

            <div className="space-y-4">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-semibold text-blue-900 mb-2">A. Derecho de Acceso</h4>
                <p className="text-sm text-blue-800 mb-2">
                  Puede solicitar información sobre qué datos personales tenemos sobre usted, para qué los usamos, y a quién los hemos comunicado.
                </p>
              </div>

              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="font-semibold text-green-900 mb-2">R. Derecho de Rectificación</h4>
                <p className="text-sm text-green-800 mb-2">
                  Si sus datos son inexactos, puede solicitar su corrección o actualización.
                </p>
              </div>

              <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
                <h4 className="font-semibold text-amber-900 mb-2">C. Derecho de Cancelación</h4>
                <p className="text-sm text-amber-800 mb-2">
                  Puede solicitar la eliminación de sus datos personales cuando ya no sean necesarios.
                </p>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-semibold text-red-900 mb-2">O. Derecho de Oposición</h4>
                <p className="text-sm text-red-800 mb-2">
                  Puede oponerse al tratamiento de sus datos para comunicaciones comerciales o publicitarias.
                </p>
              </div>
            </div>

            <div className="bg-gray-900 text-white rounded-lg p-6 mt-6">
              <h4 className="font-semibold mb-3">Cómo Ejercer sus Derechos ARCO</h4>
              <p className="text-sm mb-4">
                Para ejercer cualquiera de estos derechos, puede contactarnos mediante:
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>Email:</strong> datos@escapauy.com</p>
                <p><strong>Formulario web:</strong> www.escapauy.com/derechos-datos</p>
                <p><strong>Correo postal:</strong> [Dirección], Juan Lacaze, Colonia, Uruguay</p>
              </div>
            </div>
          </Section>

          <Section id="7" title="7. Conservación de Datos" icon={Database}>
            <p className="mb-4">
              EscapaUY conserva sus datos personales solo durante el tiempo necesario para cumplir con las finalidades:
            </p>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Plazos de Conservación</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <strong>Datos de cuenta activa:</strong> Mientras su cuenta permanezca activa y durante 5 años adicionales por obligaciones fiscales.
                </li>
                <li>
                  <strong>Datos de transacciones:</strong> 10 años desde la transacción (obligación BCU y DGI).
                </li>
                <li>
                  <strong>Registros PLAFT:</strong> 10 años desde finalización de la relación comercial (normativa BCU).
                </li>
              </ul>
            </div>
          </Section>

          <Section id="8" title="8. Cookies y Tecnologías de Seguimiento" icon={Eye}>
            <p className="mb-4">
              EscapaUY utiliza cookies y tecnologías similares para mejorar la experiencia del usuario.
            </p>

            <div className="space-y-3">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Cookies Esenciales</h4>
                <p className="text-sm mb-2">
                  Necesarias para el funcionamiento básico de la plataforma.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 mb-2">Cookies Analíticas</h4>
                <p className="text-sm mb-2">
                  Nos ayudan a entender cómo los usuarios interactúan con la plataforma.
                </p>
              </div>
            </div>
          </Section>

          <Section id="9" title="9. Menores de Edad" icon={UserCheck}>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-900 mb-2">Protección de Menores</h4>
              <p className="text-sm text-red-800 mb-3">
                EscapaUY no recolecta intencionalmente datos personales de menores de 18 años sin consentimiento de sus padres o tutores legales.
              </p>
              <p className="text-sm text-red-800 mb-3">
                Las reservas que incluyan menores deben ser realizadas por un adulto responsable.
              </p>
            </div>
          </Section>

          <Section id="10" title="10. Contacto y Consultas" icon={Mail}>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
              <h4 className="font-semibold text-xl mb-4">Contacto para Privacidad</h4>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold mb-1">Email:</p>
                  <p>datos@escapauy.com</p>
                </div>

                <div>
                  <p className="font-semibold mb-1">Teléfono:</p>
                  <p>+598 XXXX XXXX</p>
                </div>

                <div>
                  <p className="font-semibold mb-1">Dirección Postal:</p>
                  <p>[Dirección completa], Juan Lacaze, Colonia, Uruguay</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Autoridad de Control</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Unidad Reguladora y de Control de Datos Personales (URCDP)</strong>
              </p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Web: www.gub.uy/unidad-reguladora-control-datos-personales</li>
                <li>Email: urcdp@agesic.gub.uy</li>
                <li>Tel: +598 2901 2929</li>
              </ul>
            </div>
          </Section>

        </div>

        <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-blue-50 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
            <Lock className="w-4 h-4" />
            <span className="font-semibold">
              Su privacidad es nuestra prioridad
            </span>
          </div>
          <p className="text-xs text-gray-600">
            EscapaUY S.A. - Base de datos inscrita ante URCDP | Cumplimiento Ley 18.331
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Última actualización: Enero 2026 | Versión 1.0
          </p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;