// src/context/CartContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { Alert } from "react-native";
import { Product } from '../navigation/types';
import { useAuth } from '../Auth/AuthContext';

// Kiểu dữ liệu cho đơn hàng
export type Order = {
  id: number;
  items: Product[];
  total: number;
  date: string;
};

export type CartContextType = {
  cart: Product[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  checkout: () => void;
};

// 👇 khai báo và export CartContext
export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();

  const addToCart = (product: Product) => {
    if (!user) {
      Alert.alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const increaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) =>
      prev.map((p) =>
        p.id === id && (p.quantity || 1) > 1
          ? { ...p, quantity: (p.quantity || 1) - 1 }
          : p
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkout = () => {
    if (cart.length === 0) {
      Alert.alert("Giỏ hàng trống!");
      return;
    }
    const total = cart.reduce(
      (sum, item) => sum + parseInt(item.price) * (item.quantity || 1),
      0
    );
    const newOrder: Order = {
      id: Date.now(),
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    clearCart();
    Alert.alert("Đặt hàng thành công!");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        checkout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 👇 hook tiện dụng để dùng trong component
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};