import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import QRScanner from '@/components/QRScanner';

export default function PartnerDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('reservations');

  const tabs = [
    { id: 'reservations', label: 'Reservas', icon: '📅' },
    { id: 'scan', label: 'Escanear', icon: '📷' },
    { id: 'services', label: 'Servicios', icon: '✨' },
    { id: 'balance', label: 'Balance', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🤝</span>
              <h1 className="text-xl font-bold text-white hidden sm:block">Dashboard Socio</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden md:block">{user?.email}</span>
              <button
                onClick={signOut}
                className="text-red-400 hover:text-red-300 font-medium text-sm transition px-3 py-1 rounded-lg border border-red-500/20 hover:bg-red-500/10"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-4 text-center border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {activeTab === 'reservations' && (
          <div className="animate-fade-in space-y-4">
            <div className="bg-slate-900 rounded-2xl p-8 border border-white/5 text-center">
              <p className="text-slate-400">Aquí aparecerán las reservas de tus clientes.</p>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="animate-fade-in max-w-md mx-auto">
            <QRScanner />
          </div>
        )}

        {activeTab === 'services' && (
          <div className="animate-fade-in">
            <div className="bg-slate-900 rounded-2xl p-8 border border-white/5 text-center">
              <p className="text-slate-400">Gestiona tus servicios y disponibilidad.</p>
            </div>
          </div>
        )}

        {activeTab === 'balance' && (
          <div className="animate-fade-in">
            <div className="bg-slate-900 rounded-2xl p-8 border border-white/5 text-center">
              <h2 className="text-3xl font-bold text-emerald-400 mb-2">$0.00</h2>
              <p className="text-slate-400">Balance acumulado</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}