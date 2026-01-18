import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TouristWizard from './components/TouristWizard';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import Checkout from './pages/Checkout';
import TripDetail from './pages/TripDetail';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/partner-login" element={<Login />} />
            <Route path="/auth/v1/callback" element={<Login />} />

            {/* Main App Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/wizard" element={<TouristWizard />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
