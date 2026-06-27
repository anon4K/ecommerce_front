import { createContext, useContext, useState, useEffect } from 'react'
import API from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function CartProvider({ children }) {
  const { user } = useAuth()
  const [cart, setCart] = useState(null)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setCart(null)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const res = await API.get('/cart/')
      setCart(res.data)
    } catch {
      setCart(null)
    }
  }

  const addToCart = async (productId, quantity = 1) => {
    await API.post('/cart/add/', { product: productId, quantity })
    await fetchCart()
  }

  const updateItem = async (itemId, quantity) => {
    await API.patch(`/cart/item/${itemId}/`, { quantity })
    await fetchCart()
  }

  const removeItem = async (itemId) => {
    await API.delete(`/cart/item/${itemId}/`)
    await fetchCart()
  }

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, updateItem, removeItem, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}