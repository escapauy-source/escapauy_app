import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import TouristWizard from './components/TouristWizard';
import MyBookings from './pages/MyBookings';
import Checkout from './pages/Checkout';
import TripDetail from './pages/TripDetail';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ComplaintsPage from './pages/ComplaintsPage';
import LegalFooter from './components/legal/LegalFooter';
import { Toaster } from 'sonner';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          setSession(currentSession);
        }
        if (event === 'SIGNED_OUT') {
          setSession(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/complaints" element={<ComplaintsPage />} />
        <Route
          path="/dashboard"
          element={session ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin"
          element={session ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/wizard"
          element={session ? <TouristWizard /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-bookings"
          element={session ? <MyBookings /> : <Navigate to="/login" />}
        />
        <Route
          path="/checkout"
          element={session ? <Checkout /> : <Navigate to="/login" />}
        />
        <Route
          path="/trip/:id"
          element={session ? <TripDetail /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <LegalFooter />
    </Router>
  );
}

export default App;