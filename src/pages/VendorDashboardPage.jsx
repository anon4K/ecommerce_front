import { useEffect, useState } from 'react'
import API from '../services/api'

export default function VendorDashboardPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', price: '', stock: '', category: ''
  })
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProducts()
    API.get('/products/categories/').then(res => setCategories(res.data))
  }, [])

  const fetchProducts = () => {
    API.get('/products/my-products/')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      // Step 1 — create the product
      const productRes = await API.post('/products/', {
        name: form.name,
        description: form.description,
        price: form.price,
        stock: form.stock,
        category: form.category,
        is_active: true
      })

      const productId = productRes.data.id

      // Step 2 — upload image if selected
      if (image) {
        const formData = new FormData()
        formData.append('image', image)
        formData.append('is_primary', true)
        formData.append('alt_text', form.name)

        await API.post(`/products/${productId}/images/`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      setSuccess('Product listed successfully!')
      setForm({ name: '', description: '', price: '', stock: '', category: '' })
      setImage(null)
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      const data = err.response?.data
      const first = data ? Object.values(data)[0] : null
      setError(Array.isArray(first) ? first[0] : 'Failed to list product.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await API.delete(`/products/${slug}/`)
      fetchProducts()
    } catch {
      alert('Failed to delete product.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Shop</h1>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : '+ List a Product'}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
          {success}
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-700 mb-4">New Product</h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₦)
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  name="stock"
                  type="number"
                  value={form.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={e => setImage(e.target.files[0])}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Listing product...' : 'List Product'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading your products...</div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-10">
          You haven't listed any products yet.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-800">{product.name}</p>
                <p className="text-sm text-gray-400">
                  ₦{Number(product.price).toLocaleString()} · Stock: {product.stock}
                </p>
              </div>
              <button
                onClick={() => handleDelete(product.slug)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}