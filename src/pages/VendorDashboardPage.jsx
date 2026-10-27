import { useEffect, useState } from 'react'
import API from '../services/api'

const STATUS_CHOICES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-forest/10 text-forest',
  cancelled: 'bg-clay/10 text-clay',
}

export default function VendorDashboardPage() {
  const [tab, setTab] = useState('products')

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

  const [orderItems, setOrderItems] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchProducts()
    fetchOrderItems()
    API.get('/products/categories/').then(res => setCategories(res.data))
  }, [])

  const fetchProducts = () => {
    API.get('/products/my-products/')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  const fetchOrderItems = () => {
    API.get('/orders/vendor/')
      .then(res => setOrderItems(res.data))
      .catch(console.error)
      .finally(() => setOrdersLoading(false))
  }

  const handleStatusChange = async (itemId, newStatus) => {
    setUpdatingId(itemId)
    try {
      const res = await API.patch(`/orders/items/${itemId}/status/`, { status: newStatus })
      setOrderItems(prev => prev.map(item => item.id === itemId ? res.data : item))
    } catch {
      alert('Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
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
        <h1 className="font-display text-2xl font-700 text-ink">My Shop</h1>
        {tab === 'products' && (
          <button
            onClick={() => { setShowForm(!showForm); setError(''); setSuccess('') }}
            className="bg-marigold text-ink font-600 px-5 py-2 rounded-md hover:bg-marigold-dark transition-colors"
          >
            {showForm ? 'Cancel' : '+ List a Product'}
          </button>
        )}
      </div>

      <div className="flex gap-6 border-b border-mist mb-6">
        <button
          onClick={() => setTab('products')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'products' ? 'border-marigold text-ink' : 'border-transparent text-gray-400 hover:text-ink'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'orders' ? 'border-marigold text-ink' : 'border-transparent text-gray-400 hover:text-ink'
          }`}
        >
          Orders
        </button>
      </div>

      {tab === 'products' && (
        <>
          {success && (
            <div className="bg-forest/10 text-forest p-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          {showForm && (
            <div className="bg-white rounded-lg border border-mist p-6 mb-8">
              <h2 className="font-semibold text-ink mb-4">New Product</h2>
              {error && (
                <div className="bg-clay/10 text-clay p-3 rounded-lg mb-4 text-sm">
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
                      className="w-full border border-mist rounded-md px-3 py-2 focus:outline-none focus:border-marigold"
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
                      className="w-full border border-mist rounded-md px-3 py-2 focus:outline-none focus:border-marigold"
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
                      className="w-full border border-mist rounded-md px-3 py-2 focus:outline-none focus:border-marigold"
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
                      className="w-full border border-mist rounded-md px-3 py-2 focus:outline-none focus:border-marigold"
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
                    className="w-full border border-mist rounded-md px-3 py-2 focus:outline-none focus:border-marigold resize-none"
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
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-marigold/10 file:text-marigold-dark hover:file:bg-marigold/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-ink text-paper py-2 rounded-md hover:bg-marigold hover:text-ink transition-colors disabled:opacity-50 font-medium"
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
                <div key={product.id} className="bg-white rounded-lg border border-mist p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-ink">{product.name}</p>
                    <p className="text-sm text-gray-400">
                      ₦{Number(product.price).toLocaleString()} · Stock: {product.stock}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(product.slug)}
                    className="text-gray-400 hover:text-clay text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'orders' && (
        ordersLoading ? (
          <div className="text-center text-gray-400 py-10">Loading orders...</div>
        ) : orderItems.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No orders for your products yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orderItems.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-mist p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-ink">
                      {item.product_detail?.name} × {item.quantity}
                    </p>
                    <p className="text-sm text-gray-400">
                      Order #{item.order_id} · {item.customer_username} ·{' '}
                      {new Date(item.order_created_at).toLocaleDateString('en-GB', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <p className="font-semibold text-marigold-dark">
                    ₦{Number(item.subtotal).toLocaleString()}
                  </p>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Ships to: {item.shipping_address}
                </p>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {item.status}
                  </span>
                  <select
                    value={item.status}
                    disabled={updatingId === item.id}
                    onChange={e => handleStatusChange(item.id, e.target.value)}
                    className="text-sm border border-mist rounded-md px-2 py-1 focus:outline-none focus:border-marigold disabled:opacity-50"
                  >
                    {STATUS_CHOICES.map(choice => (
                      <option key={choice} value={choice}>
                        {choice.charAt(0).toUpperCase() + choice.slice(1)}
                      </option>
                    ))}
                  </select>
                  {updatingId === item.id && (
                    <span className="text-xs text-gray-400">Updating...</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}