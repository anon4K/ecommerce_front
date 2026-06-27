import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../services/api'

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      setError('Please enter a shipping address.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await API.post('/orders/create/', {
        shipping_address: address
      })
      await fetchCart()
      navigate(`/orders`)
    } catch (err) {
      const data = err.response?.data
      const msg = data?.non_field_errors?.[0] || data?.shipping_address?.[0] || 'Failed to place order.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Shipping Address</h2>
          <textarea
            rows={4}
            placeholder="Enter your full shipping address..."
            value={address}
            onChange={e => setAddress(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Placing order...' : 'Place Order'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Order Summary</h2>
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-100">
              <span className="text-gray-600">
                {item.product_detail?.name} × {item.quantity}
              </span>
              <span className="font-medium">
                ₦{Number(item.subtotal).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="flex justify-between mt-4 font-bold text-lg">
            <span>Total</span>
            <span className="text-indigo-600">₦{Number(cart.total).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}