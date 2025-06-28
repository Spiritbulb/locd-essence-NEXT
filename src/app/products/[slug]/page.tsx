'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  Share2,
  Shield,
  Truck,
  RefreshCw,
  Loader2,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { client } from '@/lib/utils/shopify';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoritesContext';

interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  quantityAvailable: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

interface ProductImage {
  url: string;
  altText: string;
  id: string;
}

interface ProductData {
  id: string;
  title: string;
  handle: string;
  description: string;
  productType: string;
  tags: string[];
  images: {
    edges: {
      node: ProductImage;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  options: {
    name: string;
    values: string[];
  }[];
}

export const runtime = 'edge';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { addToCart, loading: cartLoading } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite, loading: favoritesLoading } = useFavorites();

  const fetchProduct = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await client.request(`
        {
          productByHandle(handle: "${slug}") {
            id
            title
            handle
            description
            productType
            tags
            images(first: 10) {
              edges {
                node {
                  id
                  url(transform: { maxWidth: 800, maxHeight: 800 })
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  quantityAvailable
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            options {
              name
              values
            }
          }
        }
      `);

      const productData = response.data.productByHandle;
      if (!productData) {
        setError('Product not found');
        return;
      }

      setProduct(productData);

      // Set default selected variant (first available one)
      const firstVariant = productData.variants.edges[0]?.node;
      if (firstVariant) {
        setSelectedVariant(firstVariant);

        // Initialize selected options based on first variant
        const initialOptions: Record<string, string> = {};
        firstVariant.selectedOptions.forEach((option: { name: string; value: string }) => {
          initialOptions[option.name] = option.value;
        });
        setSelectedOptions(initialOptions);
      }

    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Update selected variant when options change
  useEffect(() => {
    if (product && Object.keys(selectedOptions).length > 0) {
      const variant = product.variants.edges.find(({ node }) => {
        return node.selectedOptions.every(option =>
          selectedOptions[option.name] === option.value
        );
      })?.node;

      if (variant) {
        setSelectedVariant(variant);
      }
    }
  }, [selectedOptions, product]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant || !product) return;

    try {
      await addToCart({
        id: product.id,
        variantId: selectedVariant.id,
        name: product.title,
        price: parseFloat(selectedVariant.price.amount),
        image: product.images.edges[0]?.node.url || ''
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = () => {
    if (!product) return;

    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        title: product.title,
        name: product.title,
        handle: product.handle,
        description: product.description,
        slug: product.handle,
        price: selectedVariant ? parseFloat(selectedVariant.price.amount) : 0,
        image: product.images.edges[0]?.node.url || '',
        brand: product.productType,
        rating: 4,
        reviews: 0,
        inStock: selectedVariant ? selectedVariant.quantityAvailable > 0 : false,
        stock: selectedVariant?.quantityAvailable || 0,
        isNew: false,
        category: product.productType,
        sku: selectedVariant?.id || product.id
      });
    }
  };

  const nextImage = () => {
    if (product && product.images.edges.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === product.images.edges.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.edges.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.images.edges.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#8a6e5d] animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
              <p className="text-red-600 mb-6">{error || 'The product you\'re looking for doesn\'t exist.'}</p>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentImage = product.images.edges[currentImageIndex]?.node;
  const isInStock = selectedVariant && selectedVariant.quantityAvailable > 0;
  const maxQuantity = selectedVariant?.quantityAvailable || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-[#8a6e5d] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#8a6e5d] transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8a6e5d] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden shadow-lg">
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.altText || product.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                  onLoad={() => setImageLoaded(true)}
                />
              )}

              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
                </div>
              )}

              {/* Image Navigation */}
              {product.images.edges.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Indicators */}
              {product.images.edges.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {product.images.edges.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-[#8a6e5d]' : 'bg-white/60'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images.edges.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.edges.map((image, index) => (
                  <button
                    key={image.node.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                        ? 'border-[#8a6e5d]'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <Image
                      src={image.node.url}
                      alt={image.node.altText || product.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Type */}
            <div className="text-sm text-[#8a6e5d] font-medium uppercase tracking-wide">
              {product.productType}
            </div>

            {/* Product Title */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                      }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">4.0 (24 reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900">
              {selectedVariant && formatPrice(parseFloat(selectedVariant.price.amount))}
            </div>

            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Product Options */}
            {product.options.length > 0 && (
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleOptionChange(option.name, value)}
                          className={`px-4 py-2 border rounded-lg transition-all ${selectedOptions[option.name] === value
                              ? 'border-[#8a6e5d] bg-[#8a6e5d] text-white'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-[#8a6e5d]'
                            }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isInStock ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              <span className={`font-medium ${isInStock ? 'text-green-600' : 'text-red-600'
                }`}>
                {isInStock ? `In Stock (${selectedVariant?.quantityAvailable} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity Selector */}
            {isInStock && (
              <div className="flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    disabled={quantity >= maxQuantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock || cartLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-semibold transition-all ${isInStock
                    ? 'bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white hover:from-[#7e4507] hover:to-[#8a6e5d] hover:shadow-lg transform hover:scale-105'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {cartLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {cartLoading ? 'Adding...' : (isInStock ? 'Add to Cart' : 'Out of Stock')}
              </button>

              <button
                onClick={handleToggleFavorite}
                disabled={favoritesLoading}
                className={`p-4 border-2 rounded-xl transition-all hover:scale-105 ${isFavorite(product.id)
                    ? 'border-red-200 bg-red-50 text-red-600'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-red-300 hover:text-red-600'
                  }`}
              >
                {favoritesLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Heart className={`w-6 h-6 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                )}
              </button>

              <button className="p-4 border-2 border-gray-300 bg-white text-gray-600 rounded-xl hover:border-gray-400 transition-all hover:scale-105">
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-[#8a6e5d]" />
                <span>Free shipping over KES 5,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-[#8a6e5d]" />
                <span>Secure payment</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RefreshCw className="w-5 h-5 text-[#8a6e5d]" />
                <span>30-day returns</span>
              </div>
            </div>

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}