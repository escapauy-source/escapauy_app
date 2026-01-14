import React, { useState } from 'react';
import { Shield, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const TermsAndConditions = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isExpanded = expandedSection === id;
    
    return (
      <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between text-left"
        >
          <span className="font-semibold text-gray-900">{title}</span>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12 text-white">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Términos y Condiciones</h1>
          </div>
          <p className="text-blue-100 text-lg">
            EscapaUY - Plataforma de Intermediación Turística
          </p>
          <p className="text-blue-200 text-sm mt-2">
            Última actualización: Enero 2026
          </p>
        </div>

        {/* Avisos Importantes */}
        <div className="px-8 py-6 bg-amber-50 border-l-4 border-amber-500">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-amber-900 mb-2">Avisos Importantes</h3>
              <ul className="text-amber-800 text-sm space-y-1">
                <li>• EscapaUY es responsable solidaria junto con el Partner por el cumplimiento del servicio</li>
                <li>• No aplica derecho de retracto para servicios con fecha determinada (Art. 16, Ley 17.250)</li>
                <li>• EscapaUY está inscrita como Proveedor de Servicios de Pago y Cobranza (PSPC) ante el BCU</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="px-8 py-8">
          
          <Section id="1" title="1. Definiciones y Naturaleza del Servicio">
            <p className="mb-4">
              <strong>EscapaUY</strong> es una plataforma digital de intermediación turística que conecta turistas con prestadores de servicios locales (en adelante, "Partners") en Uruguay.
            </p>
            <p className="mb-4">
              <strong>Naturaleza Jurídica:</strong> EscapaUY opera como Proveedor de Servicios de Pago y Cobranza (PSPC) inscrito ante el Banco Central del Uruguay (BCU), conforme a la Recopilación de Normas del Sistema de Pagos.
            </p>
            <p className="mb-4">
              <strong>Servicios Ofrecidos:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Intermediación en la reserva de experiencias turísticas</li>
              <li>Gestión de señas y pagos parciales</li>
              <li>Emisión de vouchers digitales inteligentes con código QR</li>
              <li>Sistema de recomendaciones basado en inteligencia artificial</li>
              <li>Protección "Plan B" ante contingencias climáticas</li>
            </ul>
          </Section>

          <Section id="2" title="2. Responsabilidad Solidaria de EscapaUY">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-2">Responsabilidad Legal</h4>
                  <p className="text-red-800 text-sm">
                    De conformidad con la Ley 17.250 de Relaciones de Consumo, EscapaUY es solidariamente responsable junto con el Partner por el cumplimiento del servicio contratado.
                  </p>
                </div>
              </div>
            </div>
            
            <p className="mb-4">
              Esto significa que ante cualquier incumplimiento por parte del Partner (cancelación injustificada, mala prestación del servicio, estafa), el turista puede reclamar:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>La devolución del 100% del valor total del servicio (no solo la seña)</li>
              <li>Eventuales daños y perjuicios causados por el incumplimiento</li>
              <li>Estos derechos son irrenunciables y de orden público</li>
            </ul>
            <p className="text-sm italic text-gray-600">
              EscapaUY no puede limitar esta responsabilidad mediante cláusulas contractuales, ya que los derechos del consumidor establecidos en la Ley 17.250 son de orden público e irrenunciables.
            </p>
          </Section>

          <Section id="3" title="3. Transparencia de Precios y Costos">
            <p className="mb-4">
              <strong>Información Previa:</strong> Antes de confirmar cualquier reserva, el turista visualizará:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Precio Total del Servicio:</strong> Incluye todos los impuestos (IVA)</li>
              <li><strong>Desglose de Pagos:</strong>
                <ul className="list-circle pl-6 mt-2 space-y-1">
                  <li>Monto de Seña (pagado online a EscapaUY)</li>
                  <li>Saldo en Destino (pagado directamente al Partner)</li>
                </ul>
              </li>
              <li><strong>Identificación del Partner:</strong> Nombre comercial, razón social, RUT, domicilio físico y teléfono</li>
            </ul>
            <p className="text-sm text-gray-600">
              Conforme a los Arts. 11 y 12 de la Ley 17.250, el precio final debe estar claramente informado antes de la formalización del contrato.
            </p>
          </Section>

          <Section id="4" title="4. Sistema de Señas y Manejo de Fondos">
            <p className="mb-4">
              <strong>Seña de Reserva:</strong> EscapaUY cobra una seña (fracción del precio total) para asegurar la reserva del servicio.
            </p>
            <p className="mb-4">
              <strong>Regulación BCU:</strong> Los fondos recibidos como seña:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Pueden permanecer en poder de EscapaUY hasta 30 días máximo</li>
              <li>El saldo del usuario no puede superar las 4.000 UI (aproximadamente USD 500)</li>
              <li>Pasado el plazo o superado el monto, deben ser transferidos al Partner o devueltos al turista</li>
            </ul>
            <p className="mb-4">
              <strong>Saldo en Destino:</strong> El turista paga el saldo restante directamente al Partner al momento de recibir el servicio. EscapaUY no intermedia este pago.
            </p>
          </Section>

          <Section id="5" title="5. Derecho de Retracto (NO APLICABLE)">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-900 mb-2">Excepción Legal</h4>
              <p className="text-blue-800 text-sm">
                Por tratarse de servicios de alojamiento, esparcimiento y alimentación con fecha de ejecución determinada, NO aplica el derecho de retracto de 5 días establecido en el Art. 14 de la Ley 17.250 (excepción del Art. 16).
              </p>
            </div>
            
            <p className="mb-4">
              Esto significa que una vez confirmada la reserva, el turista no puede solicitar la devolución de la seña por simple arrepentimiento.
            </p>
            <p className="mb-4">
              <strong>Excepciones:</strong> El turista SÍ puede solicitar devolución en casos de:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Incumplimiento por parte del Partner</li>
              <li>Cancelación del servicio por causas no imputables al turista</li>
              <li>Mala prestación del servicio</li>
            </ul>
          </Section>

          <Section id="6" title="6. Protección de Datos Personales">
            <p className="mb-4">
              EscapaUY cumple con la Ley 18.331 de Protección de Datos Personales y Acción de Habeas Data.
            </p>
            <p className="mb-4">
              <strong>Datos Recolectados:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Identificación: Nombre completo, documento de identidad, fecha de nacimiento</li>
              <li>Contacto: Email, teléfono</li>
              <li>Preferencias: Perfil psicológico basado en Big Five (opcional)</li>
              <li>Pago: Información procesada por pasarela de pago certificada PCI</li>
            </ul>
            <p className="mb-4">
              <strong>Uso de Datos:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Gestión de reservas y emisión de vouchers</li>
              <li>Comunicación con el Partner para ejecución del servicio</li>
              <li>Mejora de recomendaciones mediante IA</li>
              <li>Cumplimiento de obligaciones legales (prevención de lavado de activos)</li>
            </ul>
            <p className="mb-4">
              <strong>Consentimiento:</strong> Al realizar una reserva, el turista consiente expresamente que EscapaUY comunique sus datos personales (nombre y documento) al Partner específico para la ejecución del servicio.
            </p>
            <p className="mb-4">
              <strong>Derechos ARCO:</strong> El turista puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición contactando a: datos@escapauy.com
            </p>
            <p className="text-sm text-gray-600">
              La base de datos está inscrita ante la Unidad Reguladora y de Control de Datos Personales (URCDP).
            </p>
          </Section>

          <Section id="7" title="7. Voucher Inteligente y Sistema QR">
            <p className="mb-4">
              Una vez confirmada la reserva, el turista recibe un Voucher Inteligente que contiene:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Código QR único e intransferible</li>
              <li>Datos del servicio contratado</li>
              <li>Identificación del Partner (nombre, dirección, teléfono)</li>
              <li>Horario confirmado</li>
              <li>Desglose de pagos (seña pagada y saldo en destino)</li>
              <li>Indicador de "Protección Plan B" si aplica</li>
            </ul>
            <p className="mb-4">
              El Partner validará el QR al momento de prestar el servicio. El voucher certifica que el turista ha completado los controles de identidad y seguridad de la plataforma.
            </p>
          </Section>

          <Section id="8" title="8. Sistema de Protección 'Plan B' Climático">
            <p className="mb-4">
              Para actividades al aire libre, EscapaUY ofrece el servicio de "Protección Plan B":
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Monitoreo en tiempo real mediante radar Doppler</li>
              <li>Activación automática de actividad alternativa bajo techo si se detecta lluvia</li>
              <li>Notificación al turista y al Partner con 2 horas de anticipación mínima</li>
              <li>Sin costo adicional para el turista</li>
            </ul>
            <p className="text-sm text-gray-600">
              El Partner es notificado automáticamente del ajuste de capacidad cuando se activa el Plan B.
            </p>
          </Section>

          <Section id="9" title="9. Prevención de Lavado de Activos (PLAFT)">
            <p className="mb-4">
              Como PSPC, EscapaUY cumple con las obligaciones de Prevención de Lavado de Activos y Financiamiento del Terrorismo establecidas por el BCU.
            </p>
            <p className="mb-4">
              Esto incluye:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Identificación y verificación de usuarios (KYC)</li>
              <li>Monitoreo de transacciones</li>
              <li>Reporte de operaciones sospechosas</li>
              <li>Designación de Oficial de Cumplimiento</li>
            </ul>
          </Section>

          <Section id="10" title="10. Ciberseguridad y Protección de Pagos">
            <p className="mb-4">
              EscapaUY implementa estándares de PCI Cybersecurity para proteger la información financiera:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Conexión segura mediante protocolo HTTPS</li>
              <li>Encriptación de datos en tránsito y en reposo</li>
              <li>Procesamiento de pagos a través de pasarela certificada PCI DSS</li>
              <li>Auditorías periódicas de seguridad</li>
            </ul>
          </Section>

          <Section id="11" title="11. Canal de Reclamos">
            <p className="mb-4">
              EscapaUY dispone de un canal de reclamos visible y accesible sin necesidad de autenticación previa:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="font-semibold mb-2">Contacto para Reclamos:</p>
              <ul className="space-y-1 text-sm">
                <li>• Email: reclamos@escapauy.com</li>
                <li>• Teléfono: +598 XXXX XXXX</li>
                <li>• Formulario web: www.escapauy.com/reclamos</li>
                <li>• Dirección: Juan Lacaze, Colonia, Uruguay</li>
              </ul>
            </div>
            <p className="mb-4">
              Plazo de respuesta: 10 días hábiles desde la recepción del reclamo.
            </p>
            <p className="text-sm text-gray-600">
              Conforme al Art. 29 de la Ley 17.250, el proveedor debe contar con un sistema de atención de reclamos accesible.
            </p>
          </Section>

          <Section id="12" title="12. Modificaciones a los Términos">
            <p className="mb-4">
              EscapaUY se reserva el derecho de modificar estos Términos y Condiciones. Los cambios serán notificados con 10 días de anticipación mediante:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Email a los usuarios registrados</li>
              <li>Aviso destacado en la plataforma</li>
            </ul>
            <p className="mb-4">
              El uso continuado de la plataforma después de la entrada en vigencia de los cambios constituye la aceptación de los nuevos términos.
            </p>
          </Section>

          <Section id="13" title="13. Legislación Aplicable y Jurisdicción">
            <p className="mb-4">
              Estos Términos y Condiciones se rigen por las leyes de la República Oriental del Uruguay, específicamente:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Ley 17.250 - Relaciones de Consumo</li>
              <li>Ley 18.331 - Protección de Datos Personales</li>
              <li>Recopilación de Normas del Sistema de Pagos del BCU</li>
            </ul>
            <p className="mb-4">
              Para cualquier controversia derivada de estos términos, las partes se someten a la jurisdicción de los Tribunales ordinarios de Colonia, Uruguay.
            </p>
          </Section>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Shield className="w-4 h-4" />
            <span>
              EscapaUY - Plataforma inscrita como PSPC ante el BCU | Base de datos inscrita ante URCDP
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Para consultas legales: legal@escapauy.com
          </p>
        </div>

      </div>
    </div>
  );
};

export default TermsAndConditions;