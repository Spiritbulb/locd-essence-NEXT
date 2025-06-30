'use client';

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
  itemLoadingStates: Record<string, boolean>;
  updateCartBuyerIdentity: (cartId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemLoadingStates, setItemLoadingStates] = useState<Record<string, boolean>>({});
  const { accessToken, customer } = useAuth();

  // Fix hydration issues
  useEffect(() => {
    setIsClient(true);
    // Only access localStorage after component mounts
    const savedCartId = localStorage.getItem('shopifyCartId');
    if (savedCartId) {
      setCartId(savedCartId);
    }
  }, []);

  useEffect(() => {
    // Only save to localStorage on client side
    if (isClient && cartId) {
      localStorage.setItem('shopifyCartId', cartId);
    }
  }, [cartId, isClient]);

  // Improved error handling for Shopify API calls
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(data.errors[0]?.message || 'GraphQL error occurred');
      }

      return data.data;
    } catch (err) {
      console.error('Shopify API error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to communicate with Shopify';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Validate cart existence
  const validateCart = async (cartId: string): Promise<boolean> => {
    try {
      const query = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
            id
          }
        }
      `;
      const data = await shopifyFetch(query, { cartId });
      return !!data.cart;
    } catch {
      return false;
    }
  };

  // In your CartContext.tsx

// Update the getOrCreateCart function:
const getOrCreateCart = useCallback(async (): Promise<string> => {
  if (cartId) {
    const isValid = await validateCart(cartId);
    if (isValid) return cartId;
    
    setCartId(null);
    if (isClient) {
      localStorage.removeItem('shopifyCartId');
    }
  }

  const query = `
    mutation cartCreate($input: CartInput!) {
      cartCreate(input: $input) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Prepare the input with buyer identity if customer is logged in
  const input: any = {
    lines: [],
    buyerIdentity: accessToken && customer ? {
      customerAccessToken: accessToken,
      email: customer.email,
      // Include additional customer details if available
      ...(customer.firstName && { firstName: customer.firstName }),
      ...(customer.lastName && { lastName: customer.lastName }),
      ...(customer.phone && { phone: customer.phone }),
      // Add address details if you want to pre-fill shipping
      ...(customer.defaultAddress && {
        address: {
          country: customer.defaultAddress.country,
          province: customer.defaultAddress.province,
          city: customer.defaultAddress.city,
          address1: customer.defaultAddress.address1,
          address2: customer.defaultAddress.address2 || '',
          zip: customer.defaultAddress.zip,
          firstName: customer.defaultAddress.firstName,
          lastName: customer.defaultAddress.lastName,
          phone: customer.defaultAddress.phone || customer.phone || ''
        }
      })
    } : undefined
  };

  const variables = { input };
  const data = await shopifyFetch(query, variables);
  
  if (data.cartCreate.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  
  const newCartId = data.cartCreate.cart.id;
  setCartId(newCartId);
  return newCartId;
}, [cartId, accessToken, customer, isClient]);

// Add a function to update buyer identity on existing cart
const updateCartBuyerIdentity = async (cartId: string) => {
  if (!accessToken || !customer) return;

  const query = `
    mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
      cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
        cart {
          id
          checkoutUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    buyerIdentity: {
      customerAccessToken: accessToken,
      email: customer.email,
      // Include additional customer details as above
      ...(customer.phone && { phone: customer.phone }),
      // Address details if available
      ...(customer.defaultAddress && {
        address: {
          country: customer.defaultAddress.country,
          province: customer.defaultAddress.province,
          city: customer.defaultAddress.city,
          address1: customer.defaultAddress.address1,
          address2: customer.defaultAddress.address2 || '',
          zip: customer.defaultAddress.zip,
         
          phone: customer.defaultAddress.phone || customer.phone || ''
        }
      })
    }
  };

  await shopifyFetch(query, variables);
};

// Update the refreshCart function to handle buyer identity:
// In CartContext.tsx

// Update the refreshCart function to ensure it always returns an array
const refreshCart = useCallback(async () => {
  try {
    if (!cartId) {
      setCartItems([]);
      return;
    }
    
    setLoading(true);
    
    if (accessToken && customer) {
      await updateCartBuyerIdentity(cartId);
    }

    const query = `
      query getCart($cartId: ID!) {
        cart(id: $cartId) {
          id
          buyerIdentity {
            email
            customer {
              id
            }
          }
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
    
    // Ensure we always set an array, even if empty
    const refreshedItems = data?.cart?.lines?.edges?.map((edge: any) => ({
      id: edge.node.id,
      variantId: edge.node.merchandise.id,
      name: edge.node.merchandise.product.title,
      price: parseFloat(edge.node.merchandise.price.amount),
      quantity: edge.node.quantity,
      image: edge.node.merchandise.product.featuredImage?.url || ''
    })) || [];

    setCartItems(refreshedItems);
  } catch (err) {
    console.error('Failed to refresh cart:', err);
    setCartItems([]); // Reset to empty array on error
    setError(err instanceof Error ? err.message : 'Failed to refresh cart');
  } finally {
    setLoading(false);
  }
}, [cartId, accessToken, customer?.id]);


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

  // Update item quantity in cart with optimistic updates
  const updateQuantity = async (id: string, quantity: number) => {
    try {
      if (!cartId) return;
      if (quantity <= 0) {
        await removeFromCart(id);
        return;
      }

      // Optimistic update
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));

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
        lines: [{ id, quantity }]
      };

      const data = await shopifyFetch(query, variables);
      
      // Update with actual data from server
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
      // Revert optimistic update on error
      await refreshCart();
      throw err;
    }
  };

  // Update a specific cart line's quantity with loading state
  const updateCartLine = async (lineId: string, newQuantity: number) => {
    setItemLoadingStates(prev => ({ ...prev, [lineId]: true }));
    try {
      await updateQuantity(lineId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setItemLoadingStates(prev => ({ ...prev, [lineId]: false }));
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

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        refreshCart,
        updateCartLine,
        updateCartBuyerIdentity,
        cartTotal,
        itemCount,
        cartId,
        loading,
        error,
        itemLoadingStates
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