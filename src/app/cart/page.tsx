'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cartId, cartItems, loading } = useCart();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Function to create checkout
  const createCheckout = async () => {
    if (!cartId) return;

    try {
      setIsRedirecting(true);
      const response = await fetch('/api/shopify/storefront', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation checkoutCreate($cartId: ID!) {
              checkoutCreate(input: { cartId: $cartId }) {
                checkout {
                  id
                  webUrl
                }
              }
            }
          `,
          variables: {
            cartId
          }
        })
      });

      const { data, errors } = await response.json();
      
      if (errors) {
        throw new Error(errors[0]?.message || 'Failed to create checkout');
      }

      setCheckoutUrl(data.checkoutCreate.checkout.webUrl);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsRedirecting(false);
    }
  };

  // Redirect to checkout when URL is available
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg 
                className="w-8 h-8 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start shopping to add items to your cart</p>
            <Link
              href="/products"
              className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-medium hover:from-amber-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
            <div className="grid md:grid-cols-3">
              {/* Cart Items */}
              <div className="md:col-span-2 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'} in Your Cart
                </h2>
                
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100">
                      <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-2">Variant: {item.variantId}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-amber-600">
                            ${item.price.toFixed(2)}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">
                              -
                            </button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50">
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Summary */}
              <div className="bg-gray-50 p-6 border-t md:border-t-0 md:border-l border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Total</span>
                    <span className="text-xl font-bold text-amber-600">
                      ${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={createCheckout}
                  disabled={isRedirecting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isRedirecting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  By completing your purchase you agree to our Terms of Service
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}