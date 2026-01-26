
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import LoginPage from '../pages/LoginPage/LoginPage';
import HomePage from '../pages/HomePage/HomePage';
import AddEquipmentPage from '../pages/Equipment/AddEquipmentPage';
import TicketPage from '../pages/Ticket/TicketPage';
import EquipmentListPage from '../pages/Equipment/EquipmentListPage';

export default function AppRouter() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/home" replace /> : <LoginPage />} 
        />
      </Route>

      {/* Main Routes - Protected */}
      <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/" replace />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/add-equipment" element={<AddEquipmentPage />} />
        <Route path="/equipment" element={<EquipmentListPage />} />
        <Route path="/ticket" element={<TicketPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}