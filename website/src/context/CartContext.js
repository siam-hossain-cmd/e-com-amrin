'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], total: 0 });
    const [loading, setLoading] = useState(false);

    // Calculate total
    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    // Fetch cart from server (for logged-in users)
    const fetchCart = useCallback(async () => {
        if (!user) {
            // Load from localStorage for guests
            const localCart = localStorage.getItem('amrin_cart');
            if (localCart) {
                const items = JSON.parse(localCart);
                setCart({ items, total: calculateTotal(items) });
            }
            return;
        }

        try {
            setLoading(true);
            const res = await fetch('/api/cart', {
                headers: { 'Authorization': `Bearer ${user.uid}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCart({ items: data.items || [], total: calculateTotal(data.items || []) });
            }
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add item to cart
    const addToCart = async (product, variant, quantity = 1) => {
        const newItem = {
            productId: product._id,
            name: product.name,
            brand: product.brand,
            image: product.image?.url,
            size: variant?.size || 'Standard',
            color: variant?.color || '',
            price: product.basePrice,
            quantity
        };

        if (!user) {
            // Guest cart - use localStorage
            const existingItems = [...cart.items];
            const existingIndex = existingItems.findIndex(
                item => item.productId === newItem.productId && item.size === newItem.size && item.color === newItem.color
            );

            if (existingIndex >= 0) {
                existingItems[existingIndex].quantity += quantity;
            } else {
                existingItems.push(newItem);
            }

            localStorage.setItem('amrin_cart', JSON.stringify(existingItems));
            setCart({ items: existingItems, total: calculateTotal(existingItems) });
            return;
        }

        // Logged-in user - sync to server
        try {
            const res = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.uid}`
                },
                body: JSON.stringify(newItem)
            });

            if (res.ok) {
                await fetchCart();
            }
        } catch (error) {
            console.error('Failed to add to cart:', error);
        }
    };

    // Update item quantity
    const updateQuantity = async (productId, size, color, quantity) => {
        if (quantity < 1) {
            return removeFromCart(productId, size, color);
        }

        if (!user) {
            const updatedItems = cart.items.map(item => {
                if (item.productId === productId && item.size === size && item.color === color) {
                    return { ...item, quantity };
                }
                return item;
            });
            localStorage.setItem('amrin_cart', JSON.stringify(updatedItems));
            setCart({ items: updatedItems, total: calculateTotal(updatedItems) });
            return;
        }

        try {
            await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.uid}`
                },
                body: JSON.stringify({ productId, size, color, quantity })
            });
            await fetchCart();
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    // Remove item from cart
    const removeFromCart = async (productId, size, color) => {
        if (!user) {
            const updatedItems = cart.items.filter(
                item => !(item.productId === productId && item.size === size && item.color === color)
            );
            localStorage.setItem('amrin_cart', JSON.stringify(updatedItems));
            setCart({ items: updatedItems, total: calculateTotal(updatedItems) });
            return;
        }

        try {
            await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.uid}`
                },
                body: JSON.stringify({ productId, size, color })
            });
            await fetchCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    // Clear cart
    const clearCart = async () => {
        if (!user) {
            localStorage.removeItem('amrin_cart');
            setCart({ items: [], total: 0 });
            return;
        }

        try {
            await fetch('/api/cart/clear', { method: 'DELETE' });
            setCart({ items: [], total: 0 });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    };

    // Merge guest cart to user cart on login
    const mergeGuestCart = async () => {
        const localCart = localStorage.getItem('amrin_cart');
        if (localCart && user) {
            const guestItems = JSON.parse(localCart);
            for (const item of guestItems) {
                await addToCart({ _id: item.productId, name: item.name, brand: item.brand, image: { url: item.image }, basePrice: item.price }, { size: item.size, color: item.color }, item.quantity);
            }
            localStorage.removeItem('amrin_cart');
        }
    };

    const value = {
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        mergeGuestCart,
        itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0)
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}
