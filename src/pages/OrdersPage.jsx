import { useEffect, useState } from 'react'
import API from '../services/api'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get('/orders/')
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="text-center p-20 text-gray-400">Loading orders...</div>
  )

  if (orders.length === 0) return (
    <div className="text-center p-20 text-gray-400">
      You haven't placed any orders yet.
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-gray-800">Order #{order.id}</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between py-2 text-sm">
                  <span className="text-gray-600">
                    {item.product_detail?.name ?? 'Deleted Product'} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₦{Number(item.price_at_purchase * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">
                Ships to: {order.shipping_address}
              </span>
              <span className="font-bold text-indigo-600">
                ₦{Number(order.total_price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}