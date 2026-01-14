import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Navigate } from "react-router-dom";
import TouristDashboard from "./TouristDashboard";
import PartnerDashboard from "./PartnerDashboard";
import PageTransition from "@/components/PageTransition";
import SEOHead from "@/components/SEOHead";

export default function Dashboard() {
    const { user } = useAuth();
    const [role, setRole] = useState<string | null>(null);
    const [onboardingComplete, setOnboardingComplete] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRole() {
            if (!user) return;

            // 1. Prioridad: Revisar si venimos de /partner-login o hay un rol pendiente en localStorage
            const pendingRole = localStorage.getItem('pending_role');
            const userMetadataRole = user.user_metadata?.role;
            const currentPath = window.location.hash || window.location.pathname;
            const isPartnerPath = currentPath.toLowerCase().includes('partner');

            console.log("Dashboard Role Detection:", { currentPath, isPartnerPath, pendingRole, userMetadataRole });

            // Fallback inmediato antes de la DB para evitar saltos de interfaz
            const detectedRole = isPartnerPath ? 'partner' : (pendingRole || userMetadataRole || null);
            if (detectedRole) {
                setRole(detectedRole);
            }

            // 2. Fetch profile from DB for source of truth
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profile) {
                setRole(profile.role);

                // Sincronizar metadata si es necesario
                if (profile.role !== userMetadataRole) {
                    await supabase.auth.updateUser({
                        data: { role: profile.role }
                    });
                }

                if (profile.role === 'tourist') {
                    const { data: psycho } = await supabase
                        .from('psychometric_profiles')
                        .select('has_completed_onboarding')
                        .eq('user_id', user.id)
                        .single();

                    if (!psycho || !psycho.has_completed_onboarding) {
                        setOnboardingComplete(false);
                    }
                }
            } else if (detectedRole) {
                // Si no hay perfil pero detectamos rol (ej. nuevo registro), intentar crearlo o usar el detectado
                console.log("No profile found, using detected role:", detectedRole);
                setRole(detectedRole);
            }

            setLoading(false);
        }

        fetchRole();
    }, [user]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin w-12 h-12 border-4 border-gold-boutique border-t-transparent rounded-full shadow-[0_0_15px_rgba(197,160,89,0.5)]"></div>
                <p className="text-gold-boutique font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Iniciando Terminal Agéntica...</p>
            </div>
        );
    }

    if (role === 'tourist' && !onboardingComplete) {
        return <Navigate to="/onboarding" replace />;
    }

    return (
        <PageTransition>
            <SEOHead title={role === 'partner' ? "Ops Center | Partner" : "Comandancia | Turista"} />
            <div className={role === 'partner' ? "bg-slate-950 min-h-screen text-slate-100 font-serif" : "min-h-screen"}>
                {role === 'partner' ? (
                    <div className="pt-24 px-6 md:px-12">
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            :root { --accent-gold: #C5A059; }
                            .partner-accent { color: var(--accent-gold); }
                        `}} />
                        <PartnerDashboard />
                    </div>
                ) : (
                    <TouristDashboard />
                )}
            </div>
        </PageTransition>
    );
}
