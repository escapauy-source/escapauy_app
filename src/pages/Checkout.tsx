import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CreditCard, ShieldCheck, Plane, Loader2, AlertCircle, Info, Building2, Phone, MapPin, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { sendBookingConfirmation } from '@/services/emailService';
import DataConsentModal from '@/components/legal/DataConsentModal';

import { isInternationalCard, calculateFiscalBenefit } from '@/utils/BinValidator';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();
    const { user: _user } = useAuth();
    const { currency, formatPrice } = useCurrency();
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [activeTrip, setActiveTrip] = useState<any>(null);
    const [tripItems, setTripItems] = useState<any[]>([]);
    const [subtotal, setSubtotal] = useState(0);

    // Payment Form
    const [cardNumber, setCardNumber] = useState("");
    const [isForeignCard, setIsForeignCard] = useState<boolean | null>(null);
    const [validatingBin, setValidatingBin] = useState(false);

    // Estado para modal de consentimiento
    const [showConsentModal, setShowConsentModal] = useState(false);
    const [consentAccepted, setConsentAccepted] = useState(false);

    useEffect(() => {
        fetchTripDetails();
    }, []);

    const fetchTripDetails = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            const urlParams = new URLSearchParams(window.location.search);
            const tripIdFromUrl = urlParams.get('tripId');

            let query = supabase
                .from('trips')
                .select(`
                    id, 
                    ia_insight, 
                    trip_items(
                        service_id, 
                        scheduled_time, 
                        day_number, 
                        services(
                            id, 
                            title, 
                            price, 
                            category, 
                            partner_id, 
                            partner:profiles!partner_id(
                                full_name,
                                business_name,
                                rut,
                                business_address,
                                business_phone,
                                business_city
                            )
                        )
                    )
                `);

            if (tripIdFromUrl) {
                query = query.eq('id', tripIdFromUrl);
            } else {
                query = query.eq('user_id', authUser.id)
                    .eq('status', 'active')
                    .order('created_at', { ascending: false })
                    .limit(1);
            }

            const { data: trip, error } = await query.maybeSingle();

            if (error || !trip) {
                console.log("Trip not found", error);
                return;
            }

            setActiveTrip(trip);

            if (trip?.trip_items) {
                const adults = trip.ia_insight?.adults || 1;
                const children = trip.ia_insight?.children || 0;

                const items = trip.trip_items.map((t: any) => {
                    const basePrice = t.services?.price || 0;
                    const calculatedPrice = (basePrice * adults) + (basePrice * 0.5 * children);

                    const partner = t.services?.partner as any;

                    return {
                        ...t.services,
                        price: calculatedPrice,
                        base_price: basePrice,
                        partnerName: partner?.business_name || partner?.full_name || "Partner",
                        partnerRUT: partner?.rut || "N/A",
                        partnerAddress: partner?.business_address 
                            ? `${partner.business_address}, ${partner.business_city || 'Colonia'}, Uruguay`
                            : "Colonia, Uruguay",
                        partnerPhone: partner?.business_phone || "+598 XXXX XXXX",
                        scheduled_time: t.scheduled_time,
                        day_number: t.day_number,
                        planB: t.plan_b
                    };
                }).filter((s: any) => s.id);

                const hasAnyPlanB = items.some((item: any) => item.planB);
                if (hasAnyPlanB) {
                    const baseSum = items.reduce((sum: number, item: any) => sum + (item.price || 0), 0);
                    const guaranteeCost = Math.round(baseSum * 0.15);
                    items.push({
                        id: 'plan-b-guarantee',
                        title: t('checkout.plan_b_title'),
                        description: t('checkout.plan_b_desc'),
                        price: guaranteeCost,
                        category: 'insurance',
                        partner_id: null,
                        planB: true
                    });
                }

                setTripItems(items);
                setSubtotal(items
                    .filter((item: any) => item.id !== 'plan-b-guarantee')
                    .reduce((sum: number, item: any) => sum + (item.price || 0), 0)
                );
            }
        } catch (e) {
            console.error("Error fetching trip", e);
        } finally {
            setLoading(false);
        }
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '').substring(0, 16);
        setCardNumber(val);

        if (val.length >= 6) {
            setValidatingBin(true);
            setTimeout(() => {
                const isForeign = isInternationalCard(val);
                setIsForeignCard(isForeign);
                setValidatingBin(false);

                if (isForeign || activeTrip?.psychometrics?.is_vat_free) {
                    toast.success(t('checkout.fiscal_toast_success'));
                } else {
                    toast.info(t('checkout.fiscal_toast_info'));
                }
            }, 800);
        } else {
            setIsForeignCard(null);
        }
    };

    const calculateTotals = () => {
        const benefitApplies = isForeignCard === true || activeTrip?.ia_insight?.is_vat_free === true;

        if (!benefitApplies) return {
            discount: 0,
            finalTotal: subtotal,
            breakdown: []
        };

        let totalDiscount = 0;
        const breakdown: any[] = [];

        tripItems.forEach(item => {
            const category = item.category || (item.title.toLowerCase().includes('hotel') ? 'accommodation' : 'gastronomy');
            const benefit = calculateFiscalBenefit(item.price, category, true);

            if (benefit.discountAmount > 0) {
                totalDiscount += benefit.discountAmount;
                breakdown.push({
                    title: item.title,
                    saving: benefit.discountAmount,
                    label: benefit.label
                });
            }
        });

        const roundedDiscount = Math.round(totalDiscount);
        return {
            discount: roundedDiscount,
            finalTotal: subtotal - roundedDiscount,
            breakdown
        };
    };

    const { finalTotal, discount } = calculateTotals();

    const handleConfirmClick = () => {
        if (cardNumber.length < 14) {
            toast.error('Por favor ingresa un número de tarjeta válido');
            return;
        }
        setShowConsentModal(true);
    };

    const handleConsentAccepted = () => {
        setConsentAccepted(true);
        setShowConsentModal(false);
        handlePayment();
    };

    const handlePayment = async () => {
        setProcessing(true);
        const toastId = toast.loading(t('checkout.encrypting'));

        try {
            await new Promise(resolve => setTimeout(resolve, 3000));

            const integrityCheck = tripItems.every(item => {
                const fee = (item.price || 0) * 0.15;
                const net = (item.price || 0) * 0.85;
                return Math.abs((fee + net) - (item.price || 0)) < 0.01;
            });

            if (!integrityCheck) {
                console.error("[CTO-AUDIT] Financial Mismatch Detected!");
                throw new Error(t('checkout.integrity_error'));
            }
            console.log("[CTO-AUDIT] 15/85 Split Verified via Fintech Hook.");
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) throw new Error(t('checkout.session_expired'));

            if (activeTrip && tripItems.length > 0) {
                const bookings = tripItems
                    .filter(item => item.id !== 'plan-b-guarantee' && item.partner_id)
                    .map(item => ({
                        trip_id: activeTrip.id,
                        service_id: item.id,
                        partner_id: item.partner_id,
                        tourist_id: authUser.id,
                        service_price: item.price,
                        platform_fee: item.price * 0.15,
                        partner_net: item.price * 0.85,
                        status: 'confirmed',
                        scheduled_time: item.scheduled_time || '10:00',
                        day_number: item.day_number || 1
                    }));

                if (bookings.length > 0) {
                    const { error } = await supabase
                        .from('bookings')
                        .insert(bookings);

                    if (error) throw error;
                }

                await supabase
                    .from('trips')
                    .update({
                        status: 'confirmed',
                        total_price: finalTotal
                    })
                    .eq('id', activeTrip.id);
            }

            toast.success(t('checkout.success_msg'), { id: toastId });

            if (activeTrip && tripItems.length > 0) {
                try {
                    const existingBookings = JSON.parse(localStorage.getItem('myBookings') || '[]');
                    const newBooking = {
                        id: activeTrip.id,
                        orderCode: `ESC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
                        date: new Date().toLocaleDateString(),
                        items: tripItems.map(item => ({
                            title: item.title,
                            price: item.price,
                            partnerName: item.partnerName
                        })),
                        passengers: {
                            adults: activeTrip.ia_insight?.adults || 1,
                            children: activeTrip.ia_insight?.children || 0
                        },
                        total: finalTotal,
                        status: 'confirmed',
                        currency: currency
                    };
                    localStorage.setItem('myBookings', JSON.stringify([newBooking, ...existingBookings]));
                    console.log("[LOCAL-STORAGE] Booking saved to history.");
                } catch (err) {
                    console.error("[LOCAL-STORAGE] Error saving history:", err);
                }
            }

            if (activeTrip && tripItems.length > 0) {
                const adults = activeTrip.ia_insight?.adults || 1;
                const children = activeTrip.ia_insight?.children || 0;

                const itemsForEmail = tripItems.map(item => ({
                    title: item.title,
                    price: item.price,
                    planB: item.planB
                }));

                const total = finalTotal;
                const deposit = Math.round(total * 0.15);
                const balance = total - deposit;

                sendBookingConfirmation({
                    guestName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0],
                    email: authUser.email || "",
                    items: itemsForEmail,
                    date: tripItems[0].scheduled_time || 'Por confirmar',
                    guests: `${adults} ad., ${children} niñ.`,
                    currency: currency,
                    totalAmount: total,
                    depositAmount: deposit,
                    remainingBalance: balance
                }).then(() => console.log("[EMAILJS] Cart Voucher sent to", authUser.email))
                    .catch((err: any) => console.error("[EMAILJS] Failed to send cart voucher:", err));
            }

            setTimeout(() => navigate('/my-bookings'), 1500);

        } catch (e: any) {
            toast.error(t('common.error') + ": " + e.message, { id: toastId });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary" /></div>;

    const firstPartner = tripItems.find(item => item.partner_id);
    const partnerData = firstPartner ? {
        name: firstPartner.partnerName || "Partner",
        rut: firstPartner.partnerRUT || "N/A",
        address: firstPartner.partnerAddress || "Colonia, Uruguay",
        phone: firstPartner.partnerPhone || "+598 XXXX XXXX"
    } : null;

    return (
        <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">

                {/* Left: Checkout Form */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-white/50 space-y-8">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="hover:bg-slate-100 p-2 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-bold font-heading">{t('checkout.title')}</h1>
                    </div>

                    {/* Información del Partner */}
                    {partnerData && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Building2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-blue-900 mb-2">Prestador del Servicio</h3>
                                    <div className="space-y-1 text-sm">
                                        <p className="text-blue-800"><strong>Nombre:</strong> {partnerData.name}</p>
                                        <p className="text-blue-700 text-xs"><strong>RUT:</strong> {partnerData.rut}</p>
                                        <div className="flex items-start gap-1 text-blue-700 text-xs">
                                            <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                            <span>{partnerData.address}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-blue-700 text-xs">
                                            <Phone className="w-3 h-3" />
                                            <span>{partnerData.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Avisos Legales */}
                    <div className="space-y-3">
                        {/* Aviso de Responsabilidad Solidaria */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-amber-900 text-xs mb-1">Responsabilidad Solidaria</h4>
                                    <p className="text-xs text-amber-800">
                                        EscapaUY es solidariamente responsable junto con el Partner por el cumplimiento del servicio (Ley 17.250).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Aviso de NO Retracto */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-semibold text-red-900 text-xs mb-1">No Aplica Derecho de Retracto</h4>
                                    <p className="text-xs text-red-800">
                                        Por tratarse de servicios con fecha determinada, no aplica el derecho de arrepentimiento de 5 días (Art. 16, Ley 17.250).
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Link a Términos */}
                        <div className="text-center">
                            <a 
                                href="/terminos-y-condiciones" 
                                target="_blank"
                                className="text-xs text-blue-600 hover:underline flex items-center justify-center gap-1"
                            >
                                <FileText className="w-3 h-3" />
                                Ver Términos y Condiciones completos
                            </a>
                        </div>
                    </div>

                    {/* Card Input */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('checkout.card_label')}</label>
                            <div className="relative">
                                <CreditCard className="absolute left-4 top-4 text-slate-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg transition-all"
                                    value={cardNumber}
                                    onChange={handleCardChange}
                                    maxLength={19}
                                />
                                {validatingBin && (
                                    <div className="absolute right-4 top-4">
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-slate-400 mt-2 ml-1">
                                {t('checkout.encryption_label')}
                            </p>
                        </div>

                        {isForeignCard !== null && !validatingBin && (
                            <div className={`p-4 rounded-xl border flex items-start gap-3 animate-fade-in-up ${isForeignCard ? "bg-emerald-50 border-emerald-100" : "bg-slate-50 border-slate-200"}`}>
                                {isForeignCard ? <Plane className="text-emerald-500 shrink-0" /> : <CreditCard className="text-slate-400 shrink-0" />}
                                <div>
                                    <h4 className={`font-bold text-sm ${isForeignCard ? "text-emerald-800" : "text-slate-700"}`}>
                                        {isForeignCard ? t('checkout.foreigner_msg') : t('checkout.local_msg')}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-snug">
                                        {isForeignCard
                                            ? t('checkout.foreigner_desc')
                                            : t('checkout.local_desc')}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">{t('checkout.expiry_label')}</label>
                                <input type="text" placeholder="MM/YY" className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-center" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">{t('checkout.cvc_label')}</label>
                                <input type="text" placeholder="123" className="w-full px-4 py-4 rounded-xl border border-slate-200 bg-slate-50 outline-none text-center" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 pt-4 border-t border-slate-100">
                        <div className="flex justify-center items-center gap-8">
                            <div className="flex flex-col items-center gap-2 group">
                                <img src="/images/seals/seal-iva-zero.png" className="h-16 w-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform" alt="IVA 0% Seal" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600">{t('success.fiscal_status')}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 group">
                                <img src="/images/seals/seal-bcu-security.png" className="h-16 w-16 object-contain drop-shadow-md group-hover:scale-110 transition-transform" alt="BCU Security Seal" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-600">{t('partner.terminal_settings')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmClick}
                            disabled={processing || cardNumber.length < 14}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center gap-1"
                        >
                            <div className="flex items-center gap-2">
                                {processing ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                                <span>{processing ? t('checkout.processing_bcu') : `${t('common.confirm_pay')} (15%): ${formatPrice(Math.round(finalTotal * 0.15))}`}</span>
                            </div>
                            {!processing && <span className="text-[9px] font-medium opacity-50 uppercase tracking-widest">{t('checkout.segregation_protocol')}</span>}
                        </button>
                    </div>

                    <div className="flex justify-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all">
                        <img src="https://logolook.net/wp-content/uploads/2021/06/Visa-Logo.png" className="h-4" alt="Visa" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4" alt="Mastercard" />
                    </div>
                </div>

                {/* Right: Summary "The Ticket" */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
                    <div className="border-b border-dashed border-slate-200 pb-6 mb-6">
                        <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-1">{t('checkout.your_trip')}</h3>
                        <h2 className="text-3xl font-heading font-black text-slate-900">{t('checkout.fiscal_title')}</h2>
                    </div>

                    <div className="space-y-4 mb-8">
                        {tripItems.length === 0 ? (
                            <p className="text-slate-400 italic">{t('checkout.empty_trip')}</p>
                        ) : (
                            tripItems.map((item: any, idx: number) => {
                                const adultsCount = activeTrip?.ia_insight?.adults || 1;
                                const childrenCount = activeTrip?.ia_insight?.children || 0;
                                const quantityText = item.id !== 'plan-b-guarantee'
                                    ? ` x${adultsCount + childrenCount} (${adultsCount} ${t('wizard.passengers.adults')}${childrenCount > 0 ? `, ${childrenCount} ${t('wizard.passengers.children')}` : ''})`
                                    : '';

                                return (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between items-start text-sm">
                                            <div className="flex flex-col">
                                                <span className="text-slate-700 font-medium">{item.title}</span>
                                                {quantityText && <span className="text-[10px] text-slate-400 font-bold">{quantityText}</span>}
                                            </div>
                                            <span className={`font-bold ${item.id === 'plan-b-guarantee' ? 'text-blue-500' : 'text-slate-900'}`}>
                                                {item.id === 'plan-b-guarantee' ? t('checkout.local_payment') : formatPrice(item.price)}
                                            </span>
                                        </div>
                                        {item.planB && item.id !== 'plan-b-guarantee' && (
                                            <p className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded w-fit italic border border-blue-100 shadow-sm animate-pulse-subtle">
                                                🛡️ {t('summary.active_guarantee_title')}
                                            </p>
                                        )}
                                        {item.id === 'plan-b-guarantee' && (
                                            <p className="text-[9px] text-slate-400 italic">
                                                {t('checkout.plan_b_settle_local')}
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-6 space-y-3">
                        <div className="flex justify-between text-slate-500 text-sm">
                            <span>{t('checkout.subtotal_items')}</span>
                            <span className="font-bold">{formatPrice(subtotal)}</span>
                        </div>

                        {discount > 0 && (
                            <div className="flex justify-between text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-2 rounded-lg">
                                <span>{t('checkout.benefit_saving')}</span>
                                <span>-{formatPrice(discount)}</span>
                            </div>
                        )}

                        <div className="pt-2 flex justify-between text-slate-900 font-black text-lg border-b border-slate-100 pb-2">
                            <span>Precio Total (con IVA incluido)</span>
                            <span>{formatPrice(finalTotal)}</span>
                        </div>

                        <div className="space-y-3 pt-3">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-semibold text-green-900">Seña Online (15%)</p>
                                        <p className="text-[10px] text-green-700">Pagado ahora vía web</p>
                                    </div>
                                    <span className="text-lg font-black text-green-900">{formatPrice(Math.round(finalTotal * 0.15))}</span>
                                </div>
                            </div>

                            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm font-black text-red-900">Saldo en Destino (85%)</p>
                                        <p className="text-[10px] text-red-700">Pagado al Partner al recibir el servicio</p>
                                    </div>
                                    <span className="text-2xl font-black text-red-900">{formatPrice(Math.round(finalTotal * 0.85))}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                            <p className="text-[10px] text-blue-800 leading-relaxed">
                                <strong>Importante:</strong> Al confirmar esta reserva, pagarás el 15% (seña) ahora. El 85% restante lo pagarás directamente al prestador del servicio al momento de recibirlo. Ambos montos incluyen IVA.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Consentimiento de Datos */}
            {partnerData && (
                <DataConsentModal
                    isOpen={showConsentModal}
                    onAccept={handleConsentAccepted}
                    onDecline={() => setShowConsentModal(false)}
                    partnerName={partnerData.name}
                    partnerRUT={partnerData.rut}
                    partnerAddress={partnerData.address}
                    partnerPhone={partnerData.phone}
                    serviceName={tripItems.find(i => i.id !== 'plan-b-guarantee')?.title || "Experiencia en Colonia"}
                    serviceDate={newDate(tripItems[0]?.scheduled_time || Date.now()).toLocaleDateString('es-UY', {
day: 'numeric',
month: 'long',
year: 'numeric'
})}
serviceTime={tripItems[0]?.scheduled_time || "Por confirmar"}
/>
)}
</div>
);
}