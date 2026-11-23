import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const EMPTY = { items: [], subtotal: 0, count: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(EMPTY);

  const refresh = useCallback(async () => {
    if (!user) {
      setCart(EMPTY);
      return;
    }
    try {
      const data = await api('/cart', { auth: true });
      setCart(data);
    } catch {
      setCart(EMPTY);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (productId, qty = 1) => {
    const data = await api('/cart', { method: 'POST', auth: true, body: { productId, qty } });
    setCart(data);
    return data;
  };

  const setQty = async (productId, qty) => {
    const data = await api(`/cart/${productId}`, {
      method: 'PUT',
      auth: true,
      body: { qty },
    });
    setCart(data);
    return data;
  };

  const remove = async (productId) => {
    const data = await api(`/cart/${productId}`, { method: 'DELETE', auth: true });
    setCart(data);
    return data;
  };

  const clearLocal = () => setCart(EMPTY);

  const value = useMemo(
    () => ({ cart, refresh, add, setQty, remove, clearLocal }),
    [cart, refresh]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
