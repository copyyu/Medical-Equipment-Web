import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import LoginPage from '../pages/LoginPage/LoginPage'
import HomePage from '../pages/HomePage/HomePage'
import AddEquipmentPage from '../pages/Equipment/AddEquipmentPage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<AuthLayout  />}>
        <Route path="/" element={<LoginPage  />} />
      </Route>

      {/* Main */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage/>} />
        <Route path="/add-equipment" element={<AddEquipmentPage/>} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}