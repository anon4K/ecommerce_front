import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600">
          ShopHub
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-gray-600 hover:text-indigo-600">
            Products
          </Link>

          {user ? (
            <>
              <Link to="/orders" className="text-gray-600 hover:text-indigo-600">
                Orders
              </Link>
              {user?.profile?.isVendor ? (
                <Link to="/vendor/" className="text-gray-600 hover:text-indigo-600">
                  My Shop
                </Link>
              ) : (
                <Link to="/become-vendor" className="text-gray-600 hover:text-indigo-600">
                  Sell on ShopHub
                </Link>
              )

              }
              
              
              <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600">
                Cart
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-4 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <span className="text-gray-400 text-sm">Hi, {user.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-600">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}