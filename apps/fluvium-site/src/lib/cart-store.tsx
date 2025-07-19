'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { medusaHelpers } from './medusa'

interface CartItem {
  id: string
  variant_id: string
  product_id: string
  title: string
  quantity: number
  unit_price: number
  total: number
}

interface Cart {
  id: string
  items: CartItem[]
  total: number
  subtotal: number
  item_count: number
}

interface CartContextType {
  cart: Cart | null
  isLoading: boolean
  addItem: (variantId: string, quantity?: number) => Promise<void>
  updateItem: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  toggleCart: () => void
  isCartOpen: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)

  // Initialize cart on mount
  useEffect(() => {
    initializeCart()
  }, [])

  const initializeCart = async () => {
    setIsLoading(true)
    try {
      // Check if we have a cart ID in localStorage
      const existingCartId = localStorage.getItem('medusa-cart-id')
      
      if (existingCartId) {
        // Try to retrieve existing cart
        const existingCart = await medusaHelpers.getCart(existingCartId)
        if (existingCart) {
          setCart(formatCart(existingCart))
          setIsLoading(false)
          return
        }
      }

      // Create new cart if no existing cart found
      const newCart = await medusaHelpers.createCart()
      if (newCart) {
        localStorage.setItem('medusa-cart-id', newCart.id)
        setCart(formatCart(newCart))
      }
    } catch (error) {
      console.error('Failed to initialize cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCart = (medusaCart: any): Cart => {
    return {
      id: medusaCart.id,
      items: medusaCart.items?.map((item: any) => ({
        id: item.id,
        variant_id: item.variant_id,
        product_id: item.product_id,
        title: item.product?.title || item.title || 'Unknown Product',
        quantity: item.quantity,
        unit_price: item.unit_price || 0,
        total: item.total || 0
      })) || [],
      total: medusaCart.total || 0,
      subtotal: medusaCart.subtotal || 0,
      item_count: medusaCart.items?.reduce((count: number, item: any) => count + item.quantity, 0) || 0
    }
  }

  const addItem = async (variantId: string, quantity: number = 1) => {
    if (!cart) return
    
    setIsLoading(true)
    try {
      const updatedCart = await medusaHelpers.addToCart(cart.id, variantId, quantity)
      if (updatedCart) {
        setCart(formatCart(updatedCart))
        setIsCartOpen(true) // Open cart when item is added
      }
    } catch (error) {
      console.error('Failed to add item to cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateItem = async (lineItemId: string, quantity: number) => {
    if (!cart) return
    
    setIsLoading(true)
    try {
      const updatedCart = await medusaHelpers.updateCartItem(cart.id, lineItemId, quantity)
      if (updatedCart) {
        setCart(formatCart(updatedCart))
      }
    } catch (error) {
      console.error('Failed to update cart item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeItem = async (lineItemId: string) => {
    if (!cart) return
    
    setIsLoading(true)
    try {
      const updatedCart = await medusaHelpers.removeCartItem(cart.id, lineItemId)
      if (updatedCart) {
        setCart(formatCart(updatedCart))
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        toggleCart,
        isCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}