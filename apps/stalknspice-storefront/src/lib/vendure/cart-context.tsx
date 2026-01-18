'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { vendureClient, handleGraphQLError } from './client';
import { GET_ACTIVE_ORDER } from './queries/cart';
import {
  ADD_ITEM_TO_ORDER,
  ADJUST_ORDER_LINE,
  REMOVE_ORDER_LINE,
  REMOVE_ALL_ORDER_LINES,
} from './mutations/cart';
import type { ActiveOrder } from './types';

interface CartContextType {
  activeOrder: ActiveOrder;
  isLoading: boolean;
  error: string | null;
  itemCount: number;
  addToCart: (productVariantId: string, quantity: number) => Promise<void>;
  updateQuantity: (orderLineId: string, quantity: number) => Promise<void>;
  removeFromCart: (orderLineId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [activeOrder, setActiveOrder] = useState<ActiveOrder>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate total item count
  const itemCount =
    activeOrder?.lines.reduce((count, line) => count + line.quantity, 0) || 0;

  // Fetch active order on mount
  const refreshCart = useCallback(async () => {
    try {
      const data = await vendureClient.request(GET_ACTIVE_ORDER);
      setActiveOrder(data.activeOrder || null);
    } catch (err) {
      // No active order is fine
      setActiveOrder(null);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productVariantId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vendureClient.request(ADD_ITEM_TO_ORDER, {
        productVariantId,
        quantity,
      });

      if (data.addItemToOrder.__typename === 'Order') {
        setActiveOrder(data.addItemToOrder);
      } else {
        // Handle error result
        const errorMessage =
          data.addItemToOrder.message || 'Failed to add item to cart';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (orderLineId: string, quantity: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (quantity <= 0) {
        // If quantity is 0 or negative, remove the item
        await removeFromCart(orderLineId);
        return;
      }

      const data = await vendureClient.request(ADJUST_ORDER_LINE, {
        orderLineId,
        quantity,
      });

      if (data.adjustOrderLine.__typename === 'Order') {
        setActiveOrder(data.adjustOrderLine);
      } else {
        const errorMessage =
          data.adjustOrderLine.message || 'Failed to update quantity';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (orderLineId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vendureClient.request(REMOVE_ORDER_LINE, {
        orderLineId,
      });

      if (data.removeOrderLine.__typename === 'Order') {
        setActiveOrder(data.removeOrderLine);
      } else {
        const errorMessage =
          data.removeOrderLine.message || 'Failed to remove item';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await vendureClient.request(REMOVE_ALL_ORDER_LINES);

      if (data.removeAllOrderLines.__typename === 'Order') {
        setActiveOrder(data.removeAllOrderLines);
      } else {
        const errorMessage =
          data.removeAllOrderLines.message || 'Failed to clear cart';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      const errorMessage = handleGraphQLError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: CartContextType = {
    activeOrder,
    isLoading,
    error,
    itemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    clearError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
