// src/components/ProductCard.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useNotification } from '@/context/NotificationContext';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, loading: cartLoading } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite, loading: favoritesLoading } = useFavorites();
  const { notify } = useNotification();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const discount = product.discount ?? 0;
  const originalPrice = discount > 0 
    ? product.price / (1 - discount / 100)
    : product.price;

  // Create the product URL using handle
  const productUrl = `/products/${product.handle}`;

  const handleAddToCart = async () => {
    if (!product.inStock) {
      notify('This item is out of stock', 'error');
      return;
    }

    try {
      await addToCart({
        id: product.id,
        variantId: product.variants?.edges?.[0]?.node?.id || '',
        name: product.title || product.name,
        price: product.price,
        image: product.featuredImage?.url || product.image || '',
      });
    
      notify(`${product.title || product.name} added to cart!`, 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      notify('Failed to add item to cart', 'error');
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (isFavorite(product.id)) {
        await removeFromFavorites(product.id);
        notify('Removed from favorites', 'info');
      } else {
        await addToFavorites(product);
        notify('Added to favorites!', 'success');
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      notify('Failed to update favorites', 'error');
    }
  };

  const isProductFavorite = isFavorite(product.id);

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#7e4507]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg">
            New
          </span>
        )}
        {(product.discount ?? 0) > 0 && (
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold rounded-full shadow-lg">
            -{product.discount ?? 0}%
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="px-3 py-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white text-xs font-semibold rounded-full shadow-lg">
            Only {product.stock} left
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={handleToggleFavorite}
        disabled={favoritesLoading}
        className={`absolute top-4 right-4 z-10 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-200 group/heart ${
          isProductFavorite 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-white/90 hover:bg-white'
        }`}
      >
        {favoritesLoading ? (
          <div className="w-4 h-4 border-2 border-gray-200 border-t-red-500 rounded-full animate-spin"></div>
        ) : (
          <svg 
            className={`w-5 h-5 transition-all duration-200 ${
              isProductFavorite 
                ? 'text-red-500 fill-red-500' 
                : isHovered 
                  ? 'text-red-500 fill-red-500' 
                  : 'text-gray-400'
            } group-hover/heart:text-red-500 group-hover/heart:fill-red-500`}
            fill={isProductFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <Link href={productUrl} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <Image
            src={product.image || product.featuredImage?.url || '/placeholder-product.jpg'}
            alt={product.altText || product.title || product.name}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Quick View Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button 
              onClick={(e) => {
                e.preventDefault();
                notify('Quick view feature coming soon!', 'info');
              }}
              className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-amber-50 transition-colors shadow-lg"
            >
              Quick View
            </button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6">
        {/* Brand */}
        {product.brand && (
          <p className="text-sm text-amber-600 font-medium mb-2">{product.brand}</p>
        )}
        
        {/* Product Name */}
        <Link href={productUrl}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-amber-600 transition-colors">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-amber-400 fill-amber-400' 
                      : i < product.rating 
                        ? 'text-amber-400 fill-amber-400' 
                        : 'text-gray-200'
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {(product.discount ?? 0) > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`w-2 h-2 rounded-full ${
            product.inStock ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`text-sm ${
            product.inStock ? 'text-green-600' : 'text-red-600'
          }`}>
            {product.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
            product.inStock
              ? 'bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white hover:from-[#7e4507] hover:to-[#8a6e5d] hover:shadow-lg transform hover:scale-105'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          disabled={!product.inStock || cartLoading}
        >
          {cartLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Adding...
            </div>
          ) : (
            product.inStock ? 'Add to Cart' : 'Out of Stock'
          )}
        </button>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button 
            onClick={() => notify('Quick view feature coming soon!', 'info')}
            className="flex-1 py-2 px-3 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Quick View
          </button>
          <button 
            onClick={() => notify('Compare feature coming soon!', 'info')}
            className="flex-1 py-2 px-3 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Compare
          </button>
        </div>
      </div>

      {/* Hover Animation Line */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] transition-all duration-300 ${
        isHovered ? 'w-full' : 'w-0'
      }`}></div>
    </div>
  );
}