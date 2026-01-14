import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // 🧬 MIGRATION: RRD
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Calendar, MapPin, ShieldCheck, CloudRain, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLanguage } from "@/contexts/LanguageContext";
import ReviewModal from "@/components/ReviewModal";
import QRCode from "react-qr-code";

export default function TripDetail() {
    const { t } = useLanguage();
    const { id } = useParams(); // 🧬 MIGRATION: RRD useParams
    const navigate = useNavigate(); // 🧬 MIGRATION: RRD useNavigate
    const [loading, setLoading] = useState(true);
    const [trip, setTrip] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);

    // Logic for Visibility
    const isPaid = trip?.status === 'confirmed' || trip?.status === 'paid' || trip?.status === 'completed' || trip?.status === 'active';

    // Review State
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<{ id: string, name: string } | null>(null);

    // Payment State
    const [planBSelections, setPlanBSelections] = useState<Record<string, boolean>>({});
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const { formatPrice } = useCurrency();

    // Cost Calculation
    // Mock prices if not in DB (random for MVP demo if null)
    const adults = trip?.ia_insight?.adults || 1;
    const children = trip?.ia_insight?.children || 0;

    const baseTotal = items.reduce((sum, item) => {
        const price = item.services?.price || 0;
        const groupPrice = (price * adults) + (price * 0.5 * children);
        return sum + Number(groupPrice);
    }, 0);
    const totalCost = baseTotal;

    const selectedPlanBCount = Object.values(planBSelections).filter(Boolean).length;
    const hasAnyPlanB = selectedPlanBCount > 0;

    // 🧬 SENIOR FIX: Plan B is NOT charged online. Fixed payment is only for Plan A.
    // The Plan B cost is settled at the venue if rain protocol is activated.
    const finalCost = totalCost;

    const handlePayment = async () => {
        setIsPaymentProcessing(true);
        // For MVP Debugging, avoiding Edge Functions and direct redirect to our Client-Side Checkout
        // This ensures the Booking Logic (which lives in Checkout.tsx) is executed.

        toast.info(t('common.redirect_payment_gateway'));

        setTimeout(() => {
            // 🧬 MIGRATION: Fixed Navigation to Checkout with ID
            navigate(`/checkout?tripId=${trip.id}`);
        }, 1000);
    };

    useEffect(() => {
        if (!id) return;

        const fetchTripDetails = async () => {
            // 1. Fetch Trip Metadata
            const { data: tripData, error: tripError } = await supabase
                .from('trips')
                .select('*')
                .eq('id', id)
                .single();

            if (tripError) {
                console.error("Error fetching trip:", tripError);
                setLoading(false);
                return;
            }
            setTrip(tripData);

            // 2. Fetch Trip Items with Service Details
            // Note: We need to join with services table. 
            // Supabase join syntax: select('*, services(*)')
            const { data: itemsData, error: itemsError } = await supabase
                .from('trip_items')
                .select(`
                    *,
                    services (
                        *,
                        partner:profiles!partner_id(full_name)
                    )
                `)
                .eq('trip_id', id)
                .order('day_number', { ascending: true })
                .order('order_index', { ascending: true });

            if (itemsError) {
                console.error("Error fetching items:", itemsError);
            } else {
                setItems(itemsData || []);
                // Initialize Plan B selections from DB
                const selections: Record<string, boolean> = {};
                itemsData?.forEach((item: any) => {
                    if (item.plan_b) selections[item.id] = true;
                });
                setPlanBSelections(selections);
            }
            setLoading(false);
        };

        fetchTripDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
    );

    if (!trip) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <p className="text-slate-500 mb-4">{t('common.trip_not_found')}</p>
            <Link to="/">
                <button className="text-primary font-bold hover:underline">{t('common.go_home')}</button>
            </Link>
        </div>
    );

    // Group items by day
    const itemsByDay = items.reduce((acc: any, item: any) => {
        const day = item.day_number;
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="max-w-md mx-auto flex items-center gap-4">
                    <Link to="/">
                        <button className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg text-slate-900 leading-tight">{trip.name}</h1>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {
                selectedService && (
                    <ReviewModal
                        isOpen={reviewModalOpen}
                        onClose={() => setReviewModalOpen(false)}
                        serviceId={selectedService.id}
                        serviceName={selectedService.name}
                        tripId={trip.id}
                    />
                )
            }

            {/* Content */}
            <div className="max-w-md mx-auto px-4 py-8 space-y-8">
                {Object.keys(itemsByDay).map((dayNum) => (
                    <div key={dayNum} className="animate-fade-in-up">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-primary text-white font-bold w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-primary/30">
                                {dayNum}
                            </div>
                            <h2 className="font-heading font-bold text-xl text-slate-800">{t('timeline.day')} {dayNum}</h2>
                        </div>


                        <div className="border-l-2 border-slate-200 ml-5 pl-8 space-y-6 pb-4">
                            {itemsByDay[dayNum].map((item: any) => {
                                const service = item.services;
                                if (!service) return null;

                                return (
                                    <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all relative group">
                                        {/* Timeline connector dot */}
                                        <div className="absolute top-6 -left-[41px] w-4 h-4 rounded-full border-4 border-white bg-slate-300"></div>

                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-slate-100 rounded-lg shrink-0 overflow-hidden">
                                                {service.image_url ? (
                                                    <img src={service.image_url} alt={service.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-xs text-slate-400">{t('common.no_photo')}</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-black text-slate-900 leading-tight">{service.title}</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {(service.partner as any)?.full_name || t('success.holders')}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                                                        {adults} {t('wizard.passengers.adults')}
                                                        {children > 0 && `, ${children} ${t('wizard.passengers.children')}`}
                                                    </span>
                                                </div>
                                                {/* Plan B Toggle for Outdoor (Task Requirement) */}
                                                {!isPaid && service.category === 'outdoor' && (
                                                    <div className="mt-3 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center gap-2">
                                                            <CloudRain size={12} className="text-blue-500" />
                                                            <span className="text-[10px] font-bold text-slate-700">{t('checkout.plan_b_title')}</span>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                className="sr-only peer"
                                                                checked={planBSelections[item.id] || false}
                                                                onChange={async (e) => {
                                                                    const val = e.target.checked;
                                                                    setPlanBSelections(prev => ({ ...prev, [item.id]: val }));
                                                                    // Persistir en DB
                                                                    await supabase
                                                                        .from('trip_items')
                                                                        .update({ plan_b: val })
                                                                        .eq('id', item.id);
                                                                }}
                                                            />
                                                            <div className="w-7 h-4 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:after:translate-x-3"></div>
                                                        </label>
                                                    </div>
                                                )}

                                                {planBSelections[item.id] && (
                                                    <p className="text-[10px] text-blue-600 font-bold mt-1">{t('common.auto_relocation')}</p>
                                                )}

                                                <p className="text-xs text-slate-500 flex items-center gap-1 mb-2 mt-2">
                                                    <MapPin size={12} className="text-slate-400" /> {service.location}
                                                </p>

                                                {/* Conditional Visibility */}
                                                {isPaid ? (
                                                    <div className="animate-fade-in space-y-3">
                                                        <div className="flex gap-2">
                                                            {service.whatsapp && (
                                                                <a
                                                                    href={`https://wa.me/${service.whatsapp.replace(/\D/g, '')}?text=Hola, quiero reservar mi visita a ${service.title} (parte de mi viaje en EscapaUY).`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="flex-1 bg-green-50 text-green-700 text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1 hover:bg-green-100 transition-colors"
                                                                >
                                                                    <span className="fab fa-whatsapp"></span> {t('timeline.contact_whatsapp')}
                                                                </a>
                                                            )}
                                                        </div>
                                                        {/* QR Code for Redemption */}
                                                        <div className="bg-slate-50 p-3 rounded-lg flex items-center gap-3 border border-slate-200">
                                                            <div className="bg-white p-1 rounded">
                                                                <QRCode value={`verify:${trip.id}:${service.id}`} size={48} />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] uppercase font-bold text-slate-400">
                                                                    {(service.partner as any)?.full_name || t('success.holders')}
                                                                </p>
                                                                <p className="text-xs font-bold text-slate-800">{t('timeline.show_partner')}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-slate-50 p-2 rounded text-xs text-slate-500 text-center border border-dashed border-slate-200">
                                                        {t('common.reserve_to_see')}
                                                    </div>
                                                )}

                                                {/* Rate Button */}
                                                {(trip.status === 'completed' || trip.status === 'active') && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedService({ id: service.id, name: service.title });
                                                            setReviewModalOpen(true);
                                                        }}
                                                        className="mt-3 flex items-center gap-1 text-xs font-bold text-yellow-600 hover:text-yellow-700 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100 transition-colors w-fit"
                                                    >
                                                        <Star size={12} className="fill-yellow-600" />
                                                        {t('common.rate')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Payment & Guarantee Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 mt-8 animate-fade-in-up">
                    <h3 className="font-bold text-xl text-slate-900 mb-4">{t('checkout.trip_summary_title')}</h3>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center text-slate-600 text-sm">
                            <span>{t('checkout.plan_a_base_cost')}</span>
                            <span className="font-bold">{formatPrice(totalCost)}</span>
                        </div>

                        {/* Climate Guarantee Summary (Accessibility Fix) */}
                        {hasAnyPlanB && (
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3 animate-fade-in shadow-sm">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                    <CloudRain size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">{t('summary.active_guarantee_title')}</p>
                                    <p className="text-[11px] text-slate-800 mt-1 leading-snug">
                                        {t('summary.active_guarantee_desc')}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                            <div className="flex justify-between items-center text-emerald-600 font-bold">
                                <span className="text-xs uppercase tracking-widest">{t('checkout.web_deposit_label')} (15%)</span>
                                <span>{formatPrice(Math.round(finalCost * 0.15))}</span>
                            </div>
                            <div className="flex justify-between items-center text-red-600 font-black bg-red-50 p-4 rounded-xl border border-red-100">
                                <span className="text-xs uppercase tracking-widest">{t('checkout.total_at_local')} (85%)</span>
                                <span className="text-2xl">{formatPrice(Math.round(finalCost * 0.85))}</span>
                            </div>
                        </div>

                        {!isPaid && (
                            <div className="pt-2 flex justify-between items-end">
                                <span className="text-slate-900 font-bold">{t('checkout.total_to_reserve')}</span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-primary">{formatPrice(Math.round(finalCost * 0.15))}</span>
                                    <p className="text-[10px] text-slate-400">{t('checkout.only_plan_a').replace('{planB}', t('checkout.plan_b_title'))}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {isPaid ? (
                        <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-black py-4 rounded-xl shadow-sm flex items-center justify-center gap-2 animate-bounce-subtle">
                            <CheckCircle2 className="text-emerald-500" />
                            <span>{t('common.confirmed_caps')}</span>
                        </div>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={isPaymentProcessing}
                            className="w-full bg-[#009EE3] hover:bg-[#008ED0] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-400/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isPaymentProcessing ? (
                                <span className="animate-pulse">{t('common.processing')}</span>
                            ) : (
                                <>
                                    <span>{t('common.reserve_with')}</span>
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Mercado_Pago_Logo.svg/2560px-Mercado_Pago_Logo.svg.png" alt="Mercado Pago" className="h-6 object-contain invert brightness-0 grayscale opacity-90 hue-rotate-180 invert-0" style={{ filter: 'brightness(0) invert(1)' }} />
                                </>
                            )}
                        </button>
                    )}
                    <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> {t('common.secure_payment')}
                    </p>
                </div>

                {
                    items.length === 0 && (
                        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <p className="text-slate-500 mb-2">{t('common.no_activities')}</p>
                            <p className="text-sm text-slate-400">{t('common.explore_more')}</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
