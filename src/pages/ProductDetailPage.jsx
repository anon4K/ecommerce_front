import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    API.get(`/products/${slug}/`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    if (!user) return navigate('/login')
    setAdding(true)
    try {
      await addToCart(product.id, quantity)
      setMessage('Added to cart!')
      setTimeout(() => setMessage(''), 2000)
    } catch {
      setMessage('Failed to add to cart.')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return (
    <div className="text-center p-20 text-gray-400">Loading...</div>
  )

  if (!product) return null

  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0]

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-0">
        <div className="bg-gray-100 h-80 md:h-auto flex items-center justify-center">
          {primaryImage ? (
            <img
              src={primaryImage.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-gray-300">No image</span>
          )}
        </div>

        <div className="p-8">
          <p className="text-sm text-indigo-500 font-medium mb-1">
            {product.category_name}
          </p>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="inline-block bg-marigold text-ink text-2xl font-700 px-3 py-1 rounded mb-4">
            ₦{Number(product.price).toLocaleString()}
          </p>
          <p className="text-gray-500 text-sm mb-6">{product.description}</p>

          <span className="text-sm font-medium inline-flex items-center gap-1.5">
+            <span className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? 'bg-forest' : 'bg-gray-300'}`} />
+            <span className={product.in_stock ? 'text-forest' : 'text-gray-400'}>
+              {product.in_stock ? `In stock — ${product.stock} available` : 'Out of stock'}
+            </span>
          </span>

          {product.in_stock && (
            <div className="mt-4 flex items-center gap-4">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-center"
              />
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {message && (
            <p className="mt-3 text-sm text-green-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  )
}