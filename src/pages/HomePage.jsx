import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    API.get('/products/')
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="text-center p-20 text-gray-400">Loading products...</div>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Products</h1>
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-400">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(product => (
            <Link
              key={product.id}
              to={`/products/${product.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.primary_image ? (
                  <img
                    src={product.primary_image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-300 text-sm">No image</span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-indigo-500 font-medium mb-1">
                  {product.category_name}
                </p>
                <h2 className="font-semibold text-gray-800 mb-1 truncate">
                  {product.name}
                </h2>
                <p className="text-indigo-600 font-bold">
                  ₦{Number(product.price).toLocaleString()}
                </p>
                <span className={`text-xs mt-1 inline-block ${product.in_stock ? 'text-green-500' : 'text-red-400'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}