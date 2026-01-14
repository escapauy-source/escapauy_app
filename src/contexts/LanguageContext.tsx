import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'en' | 'pt';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  es: {
    'nav.my_trips': 'Mis Viajes',
    'common.see_details': 'Ver Detalles',
    'common.view_voucher': 'Ver Voucher',
    'common.close': 'Cerrar',
    'common.confirmed_caps': 'CONFIRMADO',
    'common.error': 'Error',
    'common.processing': 'Procesando',
    'common.trip_not_found': 'Viaje no encontrado',
    'common.go_home': 'Volver al inicio',
    'common.no_photo': 'Sin foto',
    'common.auto_relocation': 'Reubicación automática',
    'common.reserve_to_see': 'Reserva para ver detalles',
    'common.rate': 'Calificar',
    'common.no_activities': 'No hay actividades',
    'common.explore_more': 'Explora más opciones',
    'common.reserve_with': 'Reservar con',
    'common.secure_payment': 'Pago seguro',
    'common.redirect_payment_gateway': 'Redirigiendo al procesador de pagos',
    'common.confirm_pay': 'Confirmar y Pagar',
    'bookings.history_desc': 'Gestiona tus reservas',
    'checkout.title': 'Checkout',
    'checkout.card_label': 'Número de tarjeta',
    'checkout.encryption_label': 'Encriptación SSL',
    'checkout.foreigner_msg': 'Tarjeta internacional',
    'checkout.foreigner_desc': 'Aplican beneficios fiscales',
    'checkout.local_msg': 'Tarjeta local',
    'checkout.local_desc': 'Tarifa estándar',
    'checkout.expiry_label': 'Vencimiento',
    'checkout.cvc_label': 'CVC',
    'checkout.processing_bcu': 'Procesando con BCU',
    'checkout.segregation_protocol': 'Protocolo de segregación',
    'checkout.your_trip': 'Tu Viaje',
    'checkout.fiscal_title': 'Resumen Fiscal',
    'checkout.empty_trip': 'Carrito vacío',
    'checkout.subtotal_items': 'Subtotal',
    'checkout.benefit_saving': 'Ahorro fiscal',
    'checkout.total_pay': 'Total a pagar',
    'checkout.web_deposit_label': 'Depósito web',
    'checkout.total_at_local': 'Saldo en local',
    'checkout.plan_b_title': 'Garantía Climática',
    'checkout.plan_b_desc': 'Protección contra lluvia',
    'checkout.local_payment': 'Pago en local',
    'checkout.plan_b_settle_local': 'Se liquida en el local si se activa',
    'checkout.only_plan_a': 'Solo Plan A online',
    'checkout.encrypting': 'Encriptando datos',
    'checkout.integrity_error': 'Error de integridad',
    'checkout.session_expired': 'Sesión expirada',
    'checkout.success_msg': 'Pago exitoso',
    'checkout.fiscal_toast_success': 'Beneficios fiscales aplicados',
    'checkout.fiscal_toast_info': 'Tarifa estándar',
    'checkout.trip_summary_title': 'Resumen del Viaje',
    'checkout.plan_a_base_cost': 'Costo base Plan A',
    'checkout.total_to_reserve': 'Total para reservar',
    'wizard.passengers.adults': 'adultos',
    'wizard.passengers.children': 'niños',
    'timeline.day': 'Día',
    'timeline.contact_whatsapp': 'Contactar por WhatsApp',
    'timeline.show_partner': 'Mostrar al socio',
    'success.holders': 'EscapaUY',
    'success.fiscal_status': 'IVA 0%',
    'partner.terminal_settings': 'Certificado BCU',
    'summary.active_guarantee_title': 'Garantía Activa',
    'summary.active_guarantee_desc': 'Protección contra mal clima',
    'ticket.present': 'Presentar en local'
  },
  en: {
    'nav.my_trips': 'My Trips',
    'common.see_details': 'See Details',
    'common.view_voucher': 'View Voucher',
    'common.close': 'Close',
    'common.confirmed_caps': 'CONFIRMED',
    'common.error': 'Error',
    'common.processing': 'Processing',
    'common.trip_not_found': 'Trip not found',
    'common.go_home': 'Go home',
    'common.no_photo': 'No photo',
    'common.auto_relocation': 'Automatic relocation',
    'common.reserve_to_see': 'Reserve to see details',
    'common.rate': 'Rate',
    'common.no_activities': 'No activities',
    'common.explore_more': 'Explore more',
    'common.reserve_with': 'Reserve with',
    'common.secure_payment': 'Secure payment',
    'common.redirect_payment_gateway': 'Redirecting to payment gateway',
    'common.confirm_pay': 'Confirm and Pay',
    'bookings.history_desc': 'Manage your bookings',
    'checkout.title': 'Checkout',
    'checkout.card_label': 'Card number',
    'checkout.encryption_label': 'SSL Encryption',
    'checkout.foreigner_msg': 'International card',
    'checkout.foreigner_desc': 'Tax benefits apply',
    'checkout.local_msg': 'Local card',
    'checkout.local_desc': 'Standard rate',
    'checkout.expiry_label': 'Expiry',
    'checkout.cvc_label': 'CVC',
    'checkout.processing_bcu': 'Processing with BCU',
    'checkout.segregation_protocol': 'Segregation protocol',
    'checkout.your_trip': 'Your Trip',
    'checkout.fiscal_title': 'Fiscal Summary',
    'checkout.empty_trip': 'Empty cart',
    'checkout.subtotal_items': 'Subtotal',
    'checkout.benefit_saving': 'Tax savings',
    'checkout.total_pay': 'Total to pay',
    'checkout.web_deposit_label': 'Web deposit',
    'checkout.total_at_local': 'Balance at venue',
    'checkout.plan_b_title': 'Weather Guarantee',
    'checkout.plan_b_desc': 'Rain protection',
    'checkout.local_payment': 'Pay at venue',
    'checkout.plan_b_settle_local': 'Settled at venue if activated',
    'checkout.only_plan_a': 'Only Plan A online',
    'checkout.encrypting': 'Encrypting data',
    'checkout.integrity_error': 'Integrity error',
    'checkout.session_expired': 'Session expired',
    'checkout.success_msg': 'Payment successful',
    'checkout.fiscal_toast_success': 'Tax benefits applied',
    'checkout.fiscal_toast_info': 'Standard rate',
    'checkout.trip_summary_title': 'Trip Summary',
    'checkout.plan_a_base_cost': 'Plan A base cost',
    'checkout.total_to_reserve': 'Total to reserve',
    'wizard.passengers.adults': 'adults',
    'wizard.passengers.children': 'children',
    'timeline.day': 'Day',
    'timeline.contact_whatsapp': 'Contact via WhatsApp',
    'timeline.show_partner': 'Show to partner',
    'success.holders': 'EscapaUY',
    'success.fiscal_status': 'VAT 0%',
    'partner.terminal_settings': 'BCU Certified',
    'summary.active_guarantee_title': 'Active Guarantee',
    'summary.active_guarantee_desc': 'Bad weather protection',
    'ticket.present': 'Present at venue'
  },
  pt: {
    'nav.my_trips': 'Minhas Viagens',
    'common.see_details': 'Ver Detalhes',
    'common.view_voucher': 'Ver Voucher',
    'common.close': 'Fechar',
    'common.confirmed_caps': 'CONFIRMADO',
    'common.error': 'Erro',
    'common.processing': 'Processando',
    'common.trip_not_found': 'Viagem não encontrada',
    'common.go_home': 'Voltar ao início',
    'common.no_photo': 'Sem foto',
    'common.auto_relocation': 'Realocação automática',
    'common.reserve_to_see': 'Reserve para ver detalhes',
    'common.rate': 'Avaliar',
    'common.no_activities': 'Sem atividades',
    'common.explore_more': 'Explorar mais',
    'common.reserve_with': 'Reservar com',
    'common.secure_payment': 'Pagamento seguro',
    'common.redirect_payment_gateway': 'Redirecionando ao gateway',
    'common.confirm_pay': 'Confirmar e Pagar',
    'bookings.history_desc': 'Gerencie suas reservas',
    'checkout.title': 'Finalizar',
    'checkout.card_label': 'Número do cartão',
    'checkout.encryption_label': 'Criptografia SSL',
    'checkout.foreigner_msg': 'Cartão internacional',
    'checkout.foreigner_desc': 'Benefícios fiscais aplicam',
    'checkout.local_msg': 'Cartão local',
    'checkout.local_desc': 'Taxa padrão',
    'checkout.expiry_label': 'Validade',
    'checkout.cvc_label': 'CVC',
    'checkout.processing_bcu': 'Processando com BCU',
    'checkout.segregation_protocol': 'Protocolo de segregação',
    'checkout.your_trip': 'Sua Viagem',
    'checkout.fiscal_title': 'Resumo Fiscal',
    'checkout.empty_trip': 'Carrinho vazio',
    'checkout.subtotal_items': 'Subtotal',
    'checkout.benefit_saving': 'Economia fiscal',
    'checkout.total_pay': 'Total a pagar',
    'checkout.web_deposit_label': 'Depósito web',
    'checkout.total_at_local': 'Saldo no local',
    'checkout.plan_b_title': 'Garantia Climática',
    'checkout.plan_b_desc': 'Proteção contra chuva',
    'checkout.local_payment': 'Pagar no local',
    'checkout.plan_b_settle_local': 'Liquidado no local se ativado',
    'checkout.only_plan_a': 'Apenas Plano A online',
    'checkout.encrypting': 'Criptografando dados',
    'checkout.integrity_error': 'Erro de integridade',
    'checkout.session_expired': 'Sessão expirada',
    'checkout.success_msg': 'Pagamento bem-sucedido',
    'checkout.fiscal_toast_success': 'Benefícios fiscais aplicados',
    'checkout.fiscal_toast_info': 'Taxa padrão',
    'checkout.trip_summary_title': 'Resumo da Viagem',
    'checkout.plan_a_base_cost': 'Custo base Plano A',
    'checkout.total_to_reserve': 'Total para reservar',
    'wizard.passengers.adults': 'adultos',
    'wizard.passengers.children': 'crianças',
    'timeline.day': 'Dia',
    'timeline.contact_whatsapp': 'Contatar via WhatsApp',
    'timeline.show_partner': 'Mostrar ao parceiro',
    'success.holders': 'EscapaUY',
    'success.fiscal_status': 'IVA 0%',
    'partner.terminal_settings': 'Certificado BCU',
    'summary.active_guarantee_title': 'Garantia Ativa',
    'summary.active_guarantee_desc': 'Proteção contra mau tempo',
    'ticket.present': 'Apresentar no local'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('preferred_language');
    return (saved as Language) || 'es';
  });

  useEffect(() => {
    localStorage.setItem('preferred_language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}