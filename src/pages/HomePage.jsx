import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    API.get('/products/')
      .then(res => setProducts(Array.isArray(res.data) ? res.data : res.data.results ?? []))
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
      <div className="mb-10">
        <h1 className="font-display text-3xl font-700 text-ink mb-3">All Products</h1>
        <input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md bg-transparent border-0 border-b-2 border-mist px-1 py-2 text-ink placeholder:text-gray-400 focus:outline-none focus:border-marigold transition-colors"
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
              className="group bg-white rounded-lg border border-mist hover:border-marigold overflow-hidden transition-colors"
            >
              <div className="relative h-48 bg-gray-50 flex items-center justify-center">
                {product.primary_image ? (
                  <img
                    src={product.primary_image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-gray-300 text-sm">No image</span>
                )}
                <span className="absolute top-3 right-3 bg-marigold text-ink text-sm font-600 px-2.5 py-1 rounded shadow-sm">
                  ₦{Number(product.price).toLocaleString()}
                </span>
              </div>
              <div className="p-4">
                <p className="text-xs text-clay font-medium mb-1">
                  {product.category_name}
                </p>
                <h2 className="font-semibold text-ink mb-2 truncate group-hover:text-marigold-dark transition-colors">
                  {product.name}
                </h2>
                <span className="text-xs inline-flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${product.in_stock ? 'bg-forest' : 'bg-gray-300'}`} />
                  <span className={product.in_stock ? 'text-forest' : 'text-gray-400'}>
                    {product.in_stock ? 'In stock' : 'Out of stock'}
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}