import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart()
  const navigate = useNavigate()

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
        <Link to="/" className="text-indigo-600 hover:underline">
          Continue shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {cart.items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
              {item.product_detail?.primary_image ? (
                <img
                  src={item.product_detail.primary_image}
                  alt={item.product_detail.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-300 text-xs">No img</span>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {item.product_detail?.name}
              </h3>
              <p className="text-indigo-600 font-medium">
                ₦{Number(item.product_detail?.price).toLocaleString()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateItem(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateItem(item.id, item.quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>

            <p className="w-28 text-right font-semibold text-gray-800">
              ₦{Number(item.product_detail?.price * item.quantity).toLocaleString()} 
            </p>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-600 text-sm ml-2"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="p-4 bg-gray-50 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold text-indigo-600">
              ₦{Number(cart.total).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="bg-forest text-white px-8 py-3 rounded-md hover:bg-forest/90 font-medium"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}