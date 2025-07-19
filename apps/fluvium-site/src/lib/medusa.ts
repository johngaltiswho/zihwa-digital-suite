import { Medusa } from "@medusajs/js-sdk"

// Initialize Medusa client
export const medusa = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_test_development"
})

// Helper functions for common operations
export const medusaHelpers = {
  // Get all products
  async getProducts() {
    try {
      const response = await medusa.store.product.list()
      return response.products || []
    } catch (error) {
      console.error("Failed to fetch products:", error)
      return []
    }
  },

  // Get product by handle
  async getProductByHandle(handle: string) {
    try {
      const response = await medusa.store.product.list({ handle })
      return response.products?.[0] || null
    } catch (error) {
      console.error("Failed to fetch product:", error)
      return null
    }
  },

  // Create cart
  async createCart() {
    try {
      const response = await medusa.store.cart.create({})
      return response.cart
    } catch (error) {
      console.error("Failed to create cart:", error)
      return null
    }
  },

  // Get cart
  async getCart(cartId: string) {
    try {
      const response = await medusa.store.cart.retrieve(cartId)
      return response.cart
    } catch (error) {
      console.error("Failed to get cart:", error)
      return null
    }
  },

  // Add item to cart
  async addToCart(cartId: string, variantId: string, quantity: number = 1) {
    try {
      const response = await medusa.store.cart.lineItem.create(cartId, {
        variant_id: variantId,
        quantity
      })
      return response.cart
    } catch (error) {
      console.error("Failed to add to cart:", error)
      return null
    }
  },

  // Update cart item
  async updateCartItem(cartId: string, lineItemId: string, quantity: number) {
    try {
      const response = await medusa.store.cart.lineItem.update(cartId, lineItemId, {
        quantity
      })
      return response.cart
    } catch (error) {
      console.error("Failed to update cart item:", error)
      return null
    }
  },

  // Remove cart item
  async removeCartItem(cartId: string, lineItemId: string) {
    try {
      const response = await medusa.store.cart.lineItem.delete(cartId, lineItemId)
      return response.cart
    } catch (error) {
      console.error("Failed to remove cart item:", error)
      return null
    }
  }
}