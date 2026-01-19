import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import LoginPage from '../pages/LoginPage/LoginPage'
import HomePage from '../pages/HomePage/HomePage'

export default function AppRouter() {
  return (
    <Routes>
      {/* Auth */}
      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage/>} />
      </Route>

      {/* Main */}
      <Route element={<AuthLayout  />}>
        <Route path="/" element={<LoginPage  />} />
      </Route>

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}