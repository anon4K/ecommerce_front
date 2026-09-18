import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'
import heroImage from '../assets/hero.png'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    API.get('/products/')
      .then(res => setProducts(Array.isArray(res.data) ? res.data : res.data.results ?? []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const names = products
      .map(product => product.category_name)
      .filter(Boolean)
      .filter((name, index, list) => list.indexOf(name) === index)

    return ['All', ...names]
  }, [products])

  const filtered = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      activeCategory === 'All' || product.category_name === activeCategory

    return matchesSearch && matchesCategory
  })

  const featuredProducts = products.slice(0, 4)

  return (
    <main className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="border-b border-mist bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-marigold">
                Shop smarter
              </span>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mt-5">
                Everything you want,
                <span className="block text-marigold">all in one place.</span>
              </h1>

              <p className="mt-5 max-w-xl text-base sm:text-lg leading-7 text-gray-300">
                Discover products from independent sellers and find something worth adding to your cart.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#products"
                  className="rounded-md bg-marigold px-5 py-3 text-sm font-bold text-ink hover:bg-marigold-dark transition-colors"
                >
                  Shop products
                </a>
                <Link
                  to="/become-vendor"
                  className="rounded-md border border-white/20 px-5 py-3 text-sm font-semibold text-paper hover:bg-white/10 transition-colors"
                >
                  Sell on ShopHub
                </Link>
              </div>
            </div>

            <div className="relative hidden sm:block">
              <div className="absolute -inset-4 rounded-3xl bg-marigold/10 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl">
                <img
                  src={heroImage}
                  alt="ShopHub featured products"
                  className="w-full h-72 lg:h-80 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main shopping area */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-clay mb-2">
              Browse the marketplace
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-ink tracking-tight">
              Featured products
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Fresh picks from sellers on ShopHub.
            </p>
          </div>

          <div className="relative w-full lg:w-80">
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg border border-mist bg-white px-4 py-3 pl-10 text-sm text-ink shadow-sm outline-none transition focus:border-marigold focus:ring-2 focus:ring-marigold/20"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ⌕
            </span>
          </div>
        </div>

        {/* Categories */}
        {!loading && categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === category
                    ? 'bg-ink text-paper'
                    : 'border border-mist bg-white text-gray-600 hover:border-marigold hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="overflow-hidden rounded-xl border border-mist bg-white">
                <div className="h-52 bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />
                  <div className="h-4 w-4/5 rounded bg-gray-100 animate-pulse" />
                  <div className="h-5 w-1/3 rounded bg-gray-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-mist bg-white px-6 py-16 text-center">
            <div className="text-4xl mb-3">⌕</div>
            <h3 className="font-display text-xl font-bold text-ink">No products found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another search or choose a different category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {filtered.map(product => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="group overflow-hidden rounded-xl border border-mist bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-marigold hover:shadow-lg"
                >
                  <div className="relative h-48 sm:h-56 bg-gray-50 overflow-hidden">
                    {product.primary_image ? (
                      <img
                        src={product.primary_image}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-300">
                        No image
                      </div>
                    )}

                    {product.in_stock ? (
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-forest shadow-sm">
                        In stock
                      </span>
                    ) : (
                      <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-bold text-white">
                        Sold out
                      </span>
                    )}

                    <span className="absolute bottom-3 right-3 rounded-md bg-marigold px-2.5 py-1.5 text-sm font-bold text-ink shadow-sm">
                      ₦{Number(product.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-clay truncate">
                      {product.category_name || 'Marketplace'}
                    </p>
                    <h3 className="mt-1.5 font-semibold text-ink leading-5 line-clamp-2 min-h-10 group-hover:text-marigold-dark transition-colors">
                      {product.name}
                    </h3>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-400">View product</span>
                      <span className="text-lg text-ink transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Marketplace callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="rounded-2xl bg-marigold px-6 py-8 sm:px-10 sm:py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/60">
              Grow with ShopHub
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-2">
              Have something to sell?
            </h2>
            <p className="text-sm text-ink/70 mt-2 max-w-xl">
              Set up your seller profile and start showcasing your products to shoppers.
            </p>
          </div>
          <Link
            to="/become-vendor"
            className="shrink-0 rounded-md bg-ink px-5 py-3 text-sm font-bold text-paper hover:bg-black transition-colors"
          >
            Become a vendor →
          </Link>
        </div>
      </section>
    </main>
  )
}
