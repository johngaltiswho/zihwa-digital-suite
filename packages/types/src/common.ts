// Common types used across all apps

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'moderator'
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  quantity: number
  price: number
}

export interface PageMeta {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    fontFamily: string
  }
}