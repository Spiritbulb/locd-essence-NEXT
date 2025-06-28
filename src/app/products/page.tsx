'use client';

import { useEffect, useState } from 'react';
import { Filter, Search, Heart, ShoppingCart, Star, Grid, List, ChevronDown, Loader2 } from 'lucide-react';
import { client } from '@/lib/utils/shopify';
import ProductCard from '@/components/ProductCard';

export const runtime = 'edge';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = ['All', 'Hair Care', 'Jewelry', 'Beauty Accessories'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const fetchProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await client.request(`
        {
          products(first: 100) {
            edges {
              node {
                id
                title
                handle
                description
                productType
                featuredImage {
                  url(transform: { maxWidth: 400, maxHeight: 400 })
                  altText
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      price {
                        amount
                        currencyCode
                      }
                      quantityAvailable
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `);

      setProducts(response.data.products?.edges || []);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#8a6e5d] animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Discovering beautiful products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">⚠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-6 py-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-xl font-medium hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter and sort products based on search, category, and sortBy
  const filteredAndSortedProducts = products
    .map((p: any) => p.node) // Unwrap the Shopify edges
    .filter((product: any) => {
      const matchesCategory =
        selectedCategory === 'All' || product.productType === selectedCategory;
      const matchesSearch =
        searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'price-low':
          return (
            parseFloat(a.priceRange.minVariantPrice.amount) -
            parseFloat(b.priceRange.minVariantPrice.amount)
          );
        case 'price-high':
          return (
            parseFloat(b.priceRange.maxVariantPrice.amount) -
            parseFloat(a.priceRange.maxVariantPrice.amount)
          );
        case 'newest':
          return 0; // Add createdAt field if you want to sort by date
        case 'rating':
          return 0; // Add rating field if you want to sort by rating
        default:
          return 0; // Featured or default sorting
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Our Beautiful <span className="text-[#8a6e5d]">Collection</span>
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover premium hair care, elegant jewelry, and beauty accessories crafted for your unique style
            </p>
          </div>

          {/* Search and Filters */}
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

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-[#8a6e5d] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-[#8a6e5d]/10 hover:text-[#8a6e5d]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-3">
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
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredAndSortedProducts.map((product: any) => {
              const firstVariant = product.variants?.edges[0]?.node;
              const stock = firstVariant?.quantityAvailable || 0;
              const price = parseFloat(product.priceRange.minVariantPrice.amount);
              
              return (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    name: product.title,
                    description: product.description,
                    price: price,
                    discount: 0, // You can add discount logic if needed
                    image: product.featuredImage?.url || '',
                    altText: product.featuredImage?.altText || product.title,
                    brand: product.productType,
                    variants: product.variants,
                    inStock: stock > 0,
                    stock: stock,
                    rating: 4, // Default rating (Shopify doesn't provide this by default)
                    reviews: 0, // Default reviews count
                    isNew: false, // You can add logic to determine if product is new
                    slug: product.handle, 
                    category: product.productType || '', // Added category property
                    sku: firstVariant?.id || product.id // Added sku property (using variant id or fallback to product id)
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {filteredAndSortedProducts.length} of {products.length} products
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>
      </div>
    </div>
  );
}