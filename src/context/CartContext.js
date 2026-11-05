import React, { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import { PRODUCTS } from '../data/catalog';

const CartContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const next = { ...state };
      if (next[action.id]) delete next[action.id];
      else next[action.id] = 1;
      return next;
    }
    case 'CLEAR':
      return {};
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, {});
  const toggleItem = useCallback(id => dispatch({ type: 'TOGGLE', id }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const value = useMemo(() => {
    const totalCount = Object.values(items).reduce((sum, quantity) => sum + quantity, 0);
    const totalPrice = PRODUCTS.reduce((sum, product) =>
      sum + (items[product.id] ? product.price * items[product.id] : 0), 0);
    return { items, toggleItem, clearCart, totalCount, totalPrice };
  }, [items, toggleItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
