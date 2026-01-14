import { X } from 'lucide-react';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full"
        >
          <X size={24} />
        </button>

        <h1 className="text-3xl font-black mb-6">Política de Privacidad y Protección de Datos</h1>
        
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">1. Responsable del Tratamiento de Datos</h2>
            <p className="mb-2">
              <strong>EscapaUY</strong><br/>
              RUT: XXXXXXXXX<br/>
              Domicilio: [Dirección completa]<br/>
              Email: privacidad@escapauy.com<br/>
              Teléfono: +598 XXXX XXXX
            </p>
            <p className="mb-2">
              Bases de datos inscritas ante la Unidad Reguladora y de Control de Datos Personales (URCDP) 
              conforme a la Ley 18.331 de Protección de Datos Personales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">2. Datos Recopilados</h2>
            <h3 className="font-bold mb-2">2.1 Datos de Identificación (KYC)</h3>
            <p className="mb-2">
              Para cumplir con las normas de Prevención de Lavado de Activos (PLAFT) del BCU, recopilamos:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Nombre completo</li>
              <li>Fecha de nacimiento</li>
              <li>Número de documento de identidad</li>
              <li>País de residencia fiscal</li>
              <li>Teléfono de contacto</li>
              <li>Correo electrónico</li>
            </ul>

            <h3 className="font-bold mb-2">2.2 Datos de Pago</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Información de tarjeta de crédito/débito (procesada mediante PCI DSS)</li>
              <li>Historial de transacciones</li>
            </ul>

            <h3 className="font-bold mb-2">2.3 Datos de Navegación</h3>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Dirección IP</li>
              <li>Tipo de navegador y dispositivo</li>
              <li>Cookies técnicas y analíticas</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">3. Finalidades del Tratamiento</h2>
            <p className="mb-2">Sus datos personales son utilizados para:</p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Gestión de reservas y servicios turísticos</li>
              <li>Procesamiento de pagos (seña web)</li>
              <li>Comunicación con el Partner para la prestación del servicio</li>
              <li>Generación del Voucher Digital con QR</li>
              <li>Cumplimiento de obligaciones legales (PLAFT, facturación)</li>
              <li>Atención de reclamos y soporte al cliente</li>
              <li>Mejora de la experiencia de usuario (análisis estadísticos anonimizados)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">4. Comunicación de Datos a Terceros</h2>
            <p className="mb-2 bg-blue-50 border-l-4 border-blue-500 p-4">
              <strong>IMPORTANTE:</strong> Al confirmar una reserva, usted autoriza expresamente 
              que EscapaUY comunique sus datos personales (nombre, documento, teléfono) al Partner específico 
              para la ejecución del servicio contratado.
            </p>
            <p className="mb-2">
              Los datos se comparten con:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li><strong>Partners:</strong> Solo los datos necesarios para prestar el servicio</li>
              <li><strong>Procesadores de pago:</strong> Mercado Pago (datos de transacción)</li>
              <li><strong>Autoridades:</strong> BCU, DGI, URCDP (cuando sea legalmente requerido)</li>
            </ul>
            <p className="mb-2">
              <strong>NO</strong> vendemos ni cedemos sus datos a terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">5. Consentimiento</h2>
            <p className="mb-2">
              El consentimiento para el tratamiento de datos se otorga de forma:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li><strong>Libre:</strong> Puede negarse sin afectar otros servicios</li>
              <li><strong>Previo:</strong> Se solicita antes de recopilar los datos</li>
              <li><strong>Expreso:</strong> Mediante aceptación activa (checkbox o botón)</li>
              <li><strong>Informado:</strong> Con explicación clara del uso de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">6. Seguridad de los Datos</h2>
            <p className="mb-2">
              Implementamos medidas técnicas y organizativas para proteger sus datos:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li><strong>PCI DSS Compliance:</strong> Estándar de seguridad para datos de pago</li>
              <li><strong>HTTPS/SSL:</strong> Cifrado de datos en tránsito</li>
              <li><strong>Encriptación:</strong> Datos sensibles cifrados en reposo</li>
              <li><strong>Acceso restringido:</strong> Solo personal autorizado</li>
              <li><strong>Auditorías:</strong> Revisiones periódicas de seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">7. Derechos ARCO del Titular</h2>
            <p className="mb-2">
              Conforme al Art. 13 de la Ley 18.331, usted tiene derecho a:
            </p>
            
            <h3 className="font-bold mb-2">Acceso</h3>
            <p className="mb-2">Conocer qué datos personales tenemos sobre usted</p>

            <h3 className="font-bold mb-2">Rectificación</h3>
            <p className="mb-2">Corregir datos inexactos o incompletos</p>

            <h3 className="font-bold mb-2">Cancelación</h3>
            <p className="mb-2">Solicitar la eliminación de sus datos (excepto los legalmente requeridos)</p>

            <h3 className="font-bold mb-2">Oposición</h3>
            <p className="mb-2">Negarse a ciertos usos de sus datos (ej. marketing)</p>

            <p className="mt-4 bg-green-50 border-l-4 border-green-500 p-4">
              <strong>¿Cómo ejercer sus derechos?</strong><br/>
              Envíe un correo a: <strong>privacidad@escapauy.com</strong><br/>
              Responderemos en un plazo máximo de 10 días hábiles.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">8. Conservación de Datos</h2>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li><strong>Datos de reservas:</strong> 5 años (obligación fiscal)</li>
              <li><strong>Datos de pago:</strong> 13 meses (normas PCI DSS)</li>
              <li><strong>Datos de KYC:</strong> 5 años (normas PLAFT del BCU)</li>
              <li><strong>Cookies:</strong> Hasta 12 meses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">9. Cookies y Tecnologías Similares</h2>
            <p className="mb-2">
              Utilizamos cookies para:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li><strong>Técnicas:</strong> Funcionamiento básico de la plataforma (imprescindibles)</li>
              <li><strong>Analíticas:</strong> Estadísticas de uso (Google Analytics, anonimizadas)</li>
              <li><strong>Preferencias:</strong> Idioma, moneda (mejora de experiencia)</li>
            </ul>
            <p className="mb-2">
              Puede configurar su navegador para rechazar cookies, pero esto puede afectar la funcionalidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">10. Transferencias Internacionales</h2>
            <p className="mb-2">
              Algunos proveedores de servicios (ej. servidores en la nube) pueden estar ubicados fuera de Uruguay. 
              En estos casos, nos aseguramos de que cumplan con estándares adecuados de protección de datos 
              mediante cláusulas contractuales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">11. Menores de Edad</h2>
            <p className="mb-2">
              La Plataforma no está dirigida a menores de 18 años. Si un menor proporcionó datos sin consentimiento 
              parental, contacte inmediatamente a privacidad@escapauy.com para su eliminación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">12. Modificaciones a esta Política</h2>
            <p className="mb-2">
              Nos reservamos el derecho de actualizar esta política. Los cambios significativos serán notificados 
              con al menos 10 días de anticipación mediante email o aviso en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-slate-900">13. Contacto y Reclamos</h2>
            <p className="mb-2">
              Para consultas, reclamos o ejercicio de derechos:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Email: privacidad@escapauy.com</li>
              <li>Teléfono: +598 XXXX XXXX</li>
              <li>Dirección: [Domicilio completo]</li>
            </ul>
            <p className="mb-2">
              Si no queda satisfecho, puede presentar una denuncia ante la URCDP:
            </p>
            <ul className="list-disc ml-6 mb-4 space-y-1">
              <li>Web: www.gub.uy/unidad-reguladora-control-datos-personales</li>
              <li>Email: urcdp@agesic.gub.uy</li>
            </ul>
          </section>

          <section className="border-t pt-4">
            <p className="text-xs text-slate-500">
              Última actualización: 13 de enero de 2026<br/>
              EscapaUY - Plataforma de Escapadas Aseguradas<br/>
              Bases de datos inscritas ante URCDP bajo expediente N° [NÚMERO]
            </p>
          </section>
        </div>

        <div className="flex justify-center mt-8 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-bold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}