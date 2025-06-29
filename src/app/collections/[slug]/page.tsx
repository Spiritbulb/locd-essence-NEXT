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
  Loader2,
  Grid,
  List,
  ChevronDown,
  Filter,
  Search,
  Package,
  Sparkles,
  Crown,
  SortAsc
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
}

interface ProductImage {
  url: string;
  altText: string;
  id: string;
}

interface CollectionProduct {
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
}

interface CollectionData {
  id: string;
  title: string;
  handle: string;
  description: string;
  image?: {
    url: string;
    altText: string;
  };
  products: {
    edges: {
      node: CollectionProduct;
    }[];
  };
}

export const runtime = 'edge';

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [collection, setCollection] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { addToCart, loading: cartLoading } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'title-asc', label: 'A-Z' },
    { value: 'title-desc', label: 'Z-A' },
    { value: 'newest', label: 'Newest First' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under KES 2,000' },
    { value: 'mid', label: 'KES 2,000 - KES 10,000' },
    { value: 'high', label: 'Over KES 10,000' }
  ];

  const fetchCollection = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await client.request(`
        {
          collectionByHandle(handle: "${slug}") {
            id
            title
            handle
            description
            image {
              url(transform: { maxWidth: 1200, maxHeight: 600 })
              altText
            }
            products(first: 50) {
              edges {
                node {
                  id
                  title
                  handle
                  description
                  productType
                  tags
                  images(first: 5) {
                    edges {
                      node {
                        id
                        url(transform: { maxWidth: 400, maxHeight: 400 })
                        altText
                      }
                    }
                  }
                  variants(first: 10) {
                    edges {
                      node {
                        id
                        title
                        price {
                          amount
                          currencyCode
                        }
                        quantityAvailable
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `);

      const collectionData = response.data.collectionByHandle;
      if (!collectionData) {
        setError('Collection not found');
        return;
      }

      setCollection(collectionData);
    } catch (err: any) {
      console.error('Error fetching collection:', err);
      setError(err.message || 'Failed to fetch collection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCollection();
    }
  }, [slug]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
    }).format(price);
  };

  const handleAddToCart = async (product: CollectionProduct) => {
    const firstVariant = product.variants.edges[0]?.node;
    if (!firstVariant) return;

    try {
      await addToCart({
        id: product.id,
        variantId: firstVariant.id,
        name: product.title,
        price: parseFloat(firstVariant.price.amount),
        image: product.images.edges[0]?.node.url || ''
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleFavorite = (product: CollectionProduct) => {
    const firstVariant = product.variants.edges[0]?.node;
    
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
        price: firstVariant ? parseFloat(firstVariant.price.amount) : 0,
        image: product.images.edges[0]?.node.url || '',
        brand: product.productType,
        rating: 4,
        reviews: 0,
        inStock: firstVariant ? firstVariant.quantityAvailable > 0 : false,
        stock: firstVariant?.quantityAvailable || 0,
        isNew: false,
        category: product.productType,
        sku: firstVariant?.id || product.id
      });
    }
  };

  // Filter and sort products
  const filteredAndSortedProducts = collection?.products.edges
    .filter(({ node: product }) => {
      const matchesSearch = searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      const firstVariant = product.variants.edges[0]?.node;
      const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;

      const matchesPrice = priceRange === 'all' ||
        (priceRange === 'low' && price < 2000) ||
        (priceRange === 'mid' && price >= 2000 && price <= 10000) ||
        (priceRange === 'high' && price > 10000);

      return matchesPrice;
    })
    .sort((a, b) => {
      const productA = a.node;
      const productB = b.node;
      const priceA = productA.variants.edges[0]?.node ? parseFloat(productA.variants.edges[0].node.price.amount) : 0;
      const priceB = productB.variants.edges[0]?.node ? parseFloat(productB.variants.edges[0].node.price.amount) : 0;

      switch (sortBy) {
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'title-asc':
          return productA.title.localeCompare(productB.title);
        case 'title-desc':
          return productB.title.localeCompare(productA.title);
        default:
          return 0;
      }
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#8a6e5d] animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading collection...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collection Not Found</h3>
              <p className="text-red-600 mb-6">{error || 'The collection you\'re looking for doesn\'t exist.'}</p>
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Collections
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Back Button */}
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#8a6e5d] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </Link>

        {/* Collection Header */}
        <div className="mb-12">
          {collection.image && (
            <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    {collection.title}
                  </h1>
                  {collection.description && (
                    <p className="text-white/90 text-lg lg:text-xl max-w-2xl mx-auto drop-shadow">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!collection.image && (
            <div className="text-center mb-8">
              <div className="flex justify-center items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-full">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                  {collection.title}
                </h1>
              </div>
              {collection.description && (
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  {collection.description}
                </p>
              )}
            </div>
          )}

          {/* Collection Stats */}
          <div className="flex justify-center items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#8a6e5d]" />
              <span>{collection.products.edges.length} Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8a6e5d]" />
              <span>Curated Collection</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Price Range Filter */}
              <div className="relative">
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                >
                  {priceRanges.map((range) => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-white text-[#8a6e5d] shadow-sm'
                      : 'text-gray-500 hover:text-[#8a6e5d]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-white text-[#8a6e5d] shadow-sm'
                      : 'text-gray-500 hover:text-[#8a6e5d]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
          }`}>
            {filteredAndSortedProducts.map(({ node: product }) => {
              const firstVariant = product.variants.edges[0]?.node;
              const firstImage = product.images.edges[0]?.node;
              const isInStock = firstVariant && firstVariant.quantityAvailable > 0;
              const price = firstVariant ? parseFloat(firstVariant.price.amount) : 0;

              return (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#7e4507]"
                >
                  {/* Product Image */}
                  <Link href={`/products/${product.handle}`}>
                    <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                      {firstImage && (
                        <Image
                          src={firstImage.url}
                          alt={firstImage.altText || product.title}
                          fill
                          className="object-cover transition-all duration-700 group-hover:scale-110"
                        />
                      )}
                      
                      {/* Stock Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                            isInStock
                              ? 'bg-green-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleFavorite(product);
                        }}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                      >
                        <Heart
                          className={`w-4 h-4 ${
                            isFavorite(product.id)
                              ? 'text-red-500 fill-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-[#8a6e5d] font-medium uppercase tracking-wide">
                        {product.productType}
                      </span>
                    </div>

                    <Link href={`/products/${product.handle}`}>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-[#8a6e5d] transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(24)</span>
                    </div>

                    {/* Price */}
                    <div className="text-lg font-bold text-gray-900 mb-4">
                      {formatPrice(price)}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!isInStock || cartLoading}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all ${
                        isInStock
                          ? 'bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white hover:from-[#7e4507] hover:to-[#8a6e5d] hover:shadow-lg transform hover:scale-105'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {cartLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                      {cartLoading ? 'Adding...' : (isInStock ? 'Add to Cart' : 'Out of Stock')}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {collection.products.edges.length} products
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      </div>
    </div>
  );
}