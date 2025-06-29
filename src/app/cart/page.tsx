'use client';

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Loader2, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Heart, Shield, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cartId, cartItems, loading, updateCartLine, removeFromCart, refreshCart } = useCart();
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const router = useRouter();

  // Refresh cart on component mount to handle reload issues
  useEffect(() => {
    if (cartId && !loading) {
      refreshCart();
    }
  }, [cartId, refreshCart]);

  // Function to get cart with checkout URL
  const getCartCheckoutUrl = async () => {
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
            query getCart($cartId: ID!) {
              cart(id: $cartId) {
                id
                checkoutUrl
                lines(first: 50) {
                  edges {
                    node {
                      id
                      quantity
                      merchandise {
                        ... on ProductVariant {
                          id
                          title
                          price {
                            amount
                          }
                          image {
                            url
                          }
                          product {
                            title
                            handle
                          }
                        }
                      }
                    }
                  }
                }
                cost {
                  totalAmount {
                    amount
                    currencyCode
                  }
                  subtotalAmount {
                    amount
                    currencyCode
                  }
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
        throw new Error(errors[0]?.message || 'Failed to get cart');
      }

      if (data.cart?.checkoutUrl) {
        setCheckoutUrl(data.cart.checkoutUrl);
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsRedirecting(false);
    }
  };

  // Handle quantity updates
  const handleQuantityUpdate = async (lineId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(lineId);
      return;
    }

    setIsUpdating(lineId);
    try {
      await updateCartLine(lineId, newQuantity);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Handle item removal
  const handleRemoveItem = async (lineId: string) => {
    setIsUpdating(lineId);
    try {
      await removeFromCart(lineId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Redirect to checkout when URL is available
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const estimatedTax = subtotal * 0.08; // 8% estimated tax
  const total = subtotal + estimatedTax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 pt-19">
      <div className="max-w-7xl mx-auto px-2 py-1">

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-[#8a6e5d]/20 to-[#7e4507]/20 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#8a6e5d] animate-spin" />
              </div>
              <p className="text-gray-600 font-medium">Loading your cart...</p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full border-2 border-amber-700 p-3 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <ShoppingBag className="w-12 h-12 text-amber-700" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-3">Your cart is empty</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Discover our amazing collection of hair care products, jewelry, and beauty essentials to start your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/favourites')}
                className="px-8 py-4 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-2xl font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </button>
              <button
                onClick={() => router.push('/favourites')}
                className="px-8 py-4 bg-white border-2 border-[#8a6e5d]/20 text-[#8a6e5d] rounded-2xl font-medium hover:bg-[#8a6e5d]/5 hover:border-[#8a6e5d]/30 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2"

              >
                <Heart className="w-5 h-5" />
                View Wishlist
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900">
                      Cart Items ({cartItems.length})
                    </h2>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <div key={item.id} className="p-6 group hover:bg-gray-50/50 transition-all duration-300">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl shadow-sm group-hover:shadow-md transition-all duration-300">
                            <img
                              src={item.image || '/api/placeholder/200/200'}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            disabled={isUpdating === item.id}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 disabled:opacity-50"
                          >
                            {isUpdating === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1 truncate pr-4">{item.name}</h3>
                              <p className="text-sm text-gray-500">SKU: {item.variantId?.slice(-8) || 'N/A'}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#8a6e5d] mb-1">
                                KSh{item.price.toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-500">
                                KSh{(item.price * item.quantity).toFixed(2)} total
                              </div>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                                disabled={isUpdating === item.id || item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-[#8a6e5d]/30 hover:bg-[#8a6e5d]/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4 text-gray-600" />
                              </button>
                              <div className="w-16 h-10 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-transparent">
                                <span className="font-bold text-gray-900 text-lg">{item.quantity}</span>
                              </div>
                              <button
                                onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                                disabled={isUpdating === item.id}
                                className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 rounded-xl hover:border-[#8a6e5d]/30 hover:bg-[#8a6e5d]/5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isUpdating === item.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-[#8a6e5d]" />
                                ) : (
                                  <Plus className="w-4 h-4 text-gray-600" />
                                )}
                              </button>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-[#8a6e5d] hover:bg-[#8a6e5d]/5 rounded-xl transition-all duration-300">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm font-medium">Save for later</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50">
                  <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-white" />
                      </div>
                      Order Summary
                    </h2>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Pricing Breakdown */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-semibold text-black">KSh{subtotal.toFixed(2)}</span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Estimated Tax</span>
                        <span className="font-semibold text-black">KSh{estimatedTax.toFixed(2)}</span>
                      </div>



                      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-[#8a6e5d]">
                          KSh{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={getCartCheckoutUrl}
                      disabled={isRedirecting}
                      className="w-full py-4 px-6 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-2xl font-bold text-lg hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isRedirecting ? (
                        <span className="flex items-center justify-center gap-3">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-3">
                          Secure Checkout
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </button>

                    {/* Security Info */}
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                      <Shield className="w-4 h-4" />
                      <span>256-bit SSL encryption • Secure payment processing</span>
                    </div>

                    {/* Continue Shopping */}
                    <Link
                      href="/products"
                      className="block w-full py-3 px-6 text-center bg-white border-2 border-[#8a6e5d]/20 text-[#8a6e5d] rounded-2xl font-semibold hover:bg-[#8a6e5d]/5 hover:border-[#8a6e5d]/30 transition-all duration-300"
                    >
                      Continue Shopping
                    </Link>

                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                      By completing your purchase you agree to our{' '}
                      <Link href="/terms" className="text-[#8a6e5d] hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link href="/privacy" className="text-[#8a6e5d] hover:underline">Privacy Policy</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}