import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MyBookings from '@/components/MyBookings';
import TouristWizard from '@/components/TouristWizard';

export default function TouristDashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'trips' | 'explore' | 'profile'>('trips');

  const tabs = [
    { id: 'trips', label: 'Mis Viajes', icon: '✈️' },
    { id: 'explore', label: 'Explorar (ADN)', icon: '🧬' },
    { id: 'profile', label: 'Mi Perfil', icon: '👤' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Mobile/Desktop */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏖️</span>
              <h1 className="text-xl font-bold text-slate-800 hidden sm:block">Dashboard Turista</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden md:block">{user?.email}</span>
              <button
                onClick={signOut}
                className="text-red-500 hover:text-red-700 font-medium text-sm transition"
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
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-4 px-4 text-center border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'trips' && (
          <div className="animate-fade-in">
            <MyBookings />
          </div>
        )}

        {activeTab === 'explore' && (
          <div className="animate-fade-in">
            <TouristWizard />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="animate-fade-in bg-white rounded-2xl shadow p-8 text-center max-w-lg mx-auto mt-10">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
              👤
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Mi Perfil</h2>
            <p className="text-slate-500 mb-8">{user?.email}</p>

            <div className="space-y-4 text-left border-t pt-8">
              <div className="flex justify-between">
                <span className="text-slate-500">Estado</span>
                <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded">Activo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Rol</span>
                <span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">Turista</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}