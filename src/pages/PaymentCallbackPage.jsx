import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import API from '../services/api'

export default function PaymentCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { fetchCart } = useCart()
  const [state, setState] = useState('checking')
  const [message, setMessage] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const reference = params.get('reference') || params.get('trxref')
    if (!reference) {
      setState('error')
      setMessage('No payment reference found.')
      return
    }

    API.post('/payments/verify/', { reference })
      .then(res => {
        setState(res.data.status)
        if (res.data.status === 'success') {
          fetchCart()
          setTimeout(() => navigate('/orders'), 2000)
        }
      })
      .catch(err => {
        setState('error')
        setMessage(err.response?.data?.error || 'Could not verify your payment.')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      {state === 'checking' && <p className="text-gray-600">Confirming your payment...</p>}
      {state === 'success' && (
        <>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Payment successful</h2>
          <p className="text-gray-600">Taking you to your orders...</p>
        </>
      )}
      {state === 'failed' && (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Payment failed</h2>
          <Link to="/orders" className="text-indigo-600 underline">Go to my orders</Link>
        </>
      )}
      {state === 'pending' && (
        <>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Payment not completed</h2>
          <Link to="/orders" className="text-indigo-600 underline">Go to my orders</Link>
        </>
      )}
      {state === 'error' && (
        <>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          <Link to="/orders" className="text-indigo-600 underline">Go to my orders</Link>
        </>
      )}
    </div>
  )
}