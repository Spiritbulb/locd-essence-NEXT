'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartLineItem {
  variantId: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  refreshCart: () => void;
  updateCartLine: (lineId: string, newQuantity: number) => Promise<void>;
  cartTotal: number;
  itemCount: number;
  cartId: string | null;
  loading: boolean;
  error: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Inside your CartProvider component
useEffect(() => {
  // Load cart ID from localStorage if exists
  const savedCartId = localStorage.getItem('shopifyCartId');
  if (savedCartId) {
    setCartId(savedCartId);
  }
}, []);

useEffect(() => {
  // Save cart ID to localStorage when it changes
  if (cartId) {
    localStorage.setItem('shopifyCartId', cartId);
  }
}, [cartId]);

  // Helper function to call Shopify Storefront API
  const shopifyFetch = async (query: string, variables?: Record<string, unknown>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/shopify/storefront', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0]?.message || 'Error from Shopify API');
      }

      return data.data;
    } catch (err) {
      console.error('Shopify API error:', err);
      setError(err instanceof Error ? err.message : 'Failed to communicate with Shopify');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Create or get existing cart
  const getOrCreateCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;

    const query = `
      mutation cartCreate {
        cartCreate {
          cart {
            id
          }
        }
      }
    `;

    const data = await shopifyFetch(query);
    const newCartId = data.cartCreate.cart.id;
    setCartId(newCartId);
    return newCartId;
  }, [cartId]);

  // Add item to cart
  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    try {
      const currentCartId = await getOrCreateCart();
      
      const query = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        product {
                          title
                          featuredImage {
                            url
                          }
                        }
                        price {
                          amount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        cartId: currentCartId,
        lines: [{
          merchandiseId: item.variantId,
          quantity: 1
        }]
      };

      const data = await shopifyFetch(query, variables);
      
      // Update local state with the new cart items
      const newItems = data.cartLinesAdd.cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        name: edge.node.merchandise.product.title,
        price: parseFloat(edge.node.merchandise.price.amount),
        quantity: edge.node.quantity,
        image: edge.node.merchandise.product.featuredImage?.url || ''
      }));

      setCartItems(newItems);
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      throw err;
    }
  };

  // Remove item from cart
  const removeFromCart = async (id: string) => {
    try {
      if (!cartId) return;

      const query = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        product {
                          title
                          featuredImage {
                            url
                          }
                        }
                        price {
                          amount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        cartId,
        lineIds: [id]
      };

      const data = await shopifyFetch(query, variables);
      
      // Update local state with the remaining cart items
      const updatedItems = data.cartLinesRemove.cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        name: edge.node.merchandise.product.title,
        price: parseFloat(edge.node.merchandise.price.amount),
        quantity: edge.node.quantity,
        image: edge.node.merchandise.product.featuredImage?.url || ''
      }));

      setCartItems(updatedItems);
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      throw err;
    }
  };

  // Update item quantity in cart
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (!cartId) return;
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }

      const query = `
        mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 100) {
                edges {
                  node {
                    id
                    quantity
                    merchandise {
                      ... on ProductVariant {
                        id
                        product {
                          title
                          featuredImage {
                            url
                          }
                        }
                        price {
                          amount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = {
        cartId,
        lines: [{
          id,
          quantity
        }]
      };

      const data = await shopifyFetch(query, variables);
      
      // Update local state with the updated cart items
      const updatedItems = data.cartLinesUpdate.cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        name: edge.node.merchandise.product.title,
        price: parseFloat(edge.node.merchandise.price.amount),
        quantity: edge.node.quantity,
        image: edge.node.merchandise.product.featuredImage?.url || ''
      }));

      setCartItems(updatedItems);
    } catch (err) {
      console.error('Failed to update item quantity:', err);
      throw err;
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Refresh cart from Shopify
  const refreshCart = useCallback(async () => {
    try {
      if (!cartId) return;
      const query = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      product {
                        title
                        featuredImage {
                          url
                        }
                      }
                      price {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
      const variables = { cartId };
      const data = await shopifyFetch(query, variables);
      const refreshedItems = data.cart.lines.edges.map((edge: any) => ({
        id: edge.node.id,
        variantId: edge.node.merchandise.id,
        name: edge.node.merchandise.product.title,
        price: parseFloat(edge.node.merchandise.price.amount),
        quantity: edge.node.quantity,
        image: edge.node.merchandise.product.featuredImage?.url || ''
      }));
      setCartItems(refreshedItems);
    } catch (err) {
      console.error('Failed to refresh cart:', err);
    }
  }, [cartId]);

  // Update a specific cart line's quantity
  const updateCartLine = async (lineId: string, newQuantity: number) => {
    await updateQuantity(lineId, newQuantity);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        updateCartLine,
        cartTotal,
        itemCount,
        cartId,
        loading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}