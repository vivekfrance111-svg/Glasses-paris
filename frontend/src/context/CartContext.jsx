import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    const toggleCart = () => setIsOpen(!isOpen);
    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity = 1, lensOptions = null) => {
        setCartItems(prevItems => {
            const existItem = prevItems.find(x => x._id === product._id && JSON.stringify(x.lensOptions) === JSON.stringify(lensOptions));

            if (existItem) {
                return prevItems.map(x =>
                    x._id === product._id && JSON.stringify(x.lensOptions) === JSON.stringify(lensOptions)
                        ? { ...x, qty: x.qty + quantity }
                        : x
                );
            } else {
                return [...prevItems, { ...product, qty: quantity, lensOptions }];
            }
        });
    };

    const removeFromCart = (id, lensOptions) => {
        setCartItems(prevItems =>
            prevItems.filter(x => !(x._id === id && JSON.stringify(x.lensOptions) === JSON.stringify(lensOptions)))
        );
    };

    const updateQty = (id, lensOptions, qty) => {
        setCartItems(prevItems =>
            prevItems.map(x =>
                x._id === id && JSON.stringify(x.lensOptions) === JSON.stringify(lensOptions)
                    ? { ...x, qty: Number(qty) }
                    : x
            )
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const cartTotal = cartItems.reduce((acc, item) => {
        const itemPrice = item.price + (item.lensOptions?.additionalPrice || 0);
        return acc + itemPrice * item.qty;
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQty,
            clearCart,
            cartCount,
            cartTotal,
            isOpen,
            openCart,
            closeCart,
            toggleCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
