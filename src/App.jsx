import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import VendorDashboardPage from './pages/VendorDashboardPage'
import BecomeVendorPage from './pages/BecomeVendorPage'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center p-10">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:slug" element={<ProductDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={
          <PrivateRoute><CartPage /></PrivateRoute>
        } />
        <Route path="/checkout" element={
          <PrivateRoute><CheckoutPage /></PrivateRoute>
        } />
        <Route path="/orders" element={
          <PrivateRoute><OrdersPage /></PrivateRoute>
        } />
        <Route path="/vendor/" element={
          <PrivateRoute><VendorDashboardPage /></PrivateRoute>
        } />
        <Route path="/become-vendor" element={
          <PrivateRoute><BecomeVendorPage /></PrivateRoute>
        } />
      </Routes>
    </div>
  )
}