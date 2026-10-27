import { useEffect, useState } from 'react'
import API from '../services/api'

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-forest/10 text-forest',
  cancelled: 'bg-clay/10 text-clay',
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
      <h1 className="font-display text-2xl font-700 text-ink mb-6">Your Orders</h1>

      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg border border-mist p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-ink">Order #{order.id}</p>
                <p className="text-sm text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                {order.status}
              </span>
            </div>

            <div className="divide-y divide-mist">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 text-sm gap-3">
                  <span className="text-gray-600 flex-1">
                    {item.product_detail?.name ?? 'Deleted Product'} × {item.quantity}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[item.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {item.status}
                  </span>
                  <span className="font-medium text-ink w-28 text-right">
                    ₦{Number(item.price_at_purchase * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-mist">
              <span className="text-sm text-gray-500">
                Ships to: {order.shipping_address}
              </span>
              <span className="font-bold text-marigold-dark">
                ₦{Number(order.total_price).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}