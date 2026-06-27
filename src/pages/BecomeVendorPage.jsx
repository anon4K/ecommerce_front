import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function BecomeVendorPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ shop_name: '', shop_description: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await API.post('/products/become-vendor/', form)
      // Refresh user profile so navbar updates
      window.location.href = '/vendor'
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Open your shop</h1>
        <p className="text-gray-500 text-sm mb-6">
          Start selling to thousands of buyers. It's free.
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name
            </label>
            <input
              name="shop_name"
              value={form.shop_name}
              onChange={handleChange}
              placeholder="e.g. Amaka's Boutique"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Description
            </label>
            <textarea
              name="shop_description"
              value={form.shop_description}
              onChange={handleChange}
              rows={3}
              placeholder="What do you sell?"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Setting up...' : 'Open My Shop'}
          </button>
        </form>
      </div>
    </div>
  )
}