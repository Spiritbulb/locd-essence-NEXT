"use client";
import { useState, useEffect } from 'react';
import { client } from '@/lib/utils/shopify';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyPrice {
  amount: string;
}

interface ShopifyVariant {
  price: ShopifyPrice;
  sku: string;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

interface ShopifyProductsResponse {
  data?: {
    products?: {
      edges: Array<{
        node: ShopifyProductNode;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

const PRODUCTS_PER_PAGE = 12;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Products');
  const [sortOption, setSortOption] = useState('Featured');
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const getProducts = async (cursor: string | null = null) => {
    setLoading(true);
    setError(null);

    const query = `
      query ($cursor: String) {
        products(first: ${PRODUCTS_PER_PAGE}, after: $cursor) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                    sku
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `;

    try {
      //@ts-ignore
      const response = await client.request<ShopifyProductsResponse>(query, { cursor });
      
      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        throw new Error('Failed to fetch products');
      }
//@ts-ignore
      const edges = response.data?.products?.edges ?? [];
      
      const newProducts = edges.map(({ node }: { node: ShopifyProductNode }) => {
        const defaultImage = '/placeholder.jpg';
        const primaryVariant = node.variants.edges[0]?.node;
        const primaryImage = node.images.edges[0]?.node;

        return {
          id: node.id,
          slug: node.handle,
          name: node.title,
          price: parseFloat(primaryVariant?.price.amount || '0'),
          image: primaryImage?.url || defaultImage,
          altText: primaryImage?.altText || node.title,
          description: node.description,
          rating: 4.5,
          reviews: Math.floor(Math.random() * 50) + 5,
          stock: Math.floor(Math.random() * 30) + 5,
          isNew: Math.random() > 0.7,
          discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0,
          category: 'Hair Care',
          inStock: true,
          sku: primaryVariant?.sku || '',
          brand: "Loc'd Essence",
          details: node.description,
        };
      });

      if (cursor) {
        // Append new products for pagination
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        // Initial load
        setProducts(newProducts);
      }

      // Update cursor for pagination
      if (edges.length > 0) {
        setCursor(edges[edges.length - 1].cursor);
      }
      //@ts-ignore
      setHasMore(response.data?.products?.pageInfo?.hasNextPage || false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleLoadMore = () => {
    if (hasMore && cursor) {
      getProducts(cursor);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // In a real app, you would update the products based on the filter
    // For now, we'll just update the UI state
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value;
    setSortOption(option);
    
    // Sort products based on the selected option
    let sortedProducts = [...products];
    
    switch (option) {
      case 'Price: Low to High':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'Newest First':
        // Since we don't have creation dates, we'll sort randomly
        sortedProducts.sort(() => Math.random() - 0.5);
        break;
      case 'Best Rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Featured - return to original order
        break;
    }
    
    setProducts(sortedProducts);
  };

  const filteredProducts = products.filter(product => {
    switch (activeFilter) {
      case 'New Arrivals':
        return product.isNew;
      case 'On Sale':
        //@ts-ignore
        return product.discount > 0;
      default:
        return true;
    }
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-900 via-amber-800 to-orange-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              Our Products
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed">
              Discover our carefully curated collection of premium hair care products designed to nourish and celebrate your natural beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {['All Products', 'New Arrivals', 'Best Sellers', 'On Sale'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterChange(filter)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter === activeFilter
                      ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select 
              value={sortOption}
              onChange={handleSortChange}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Best Rating</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-2xl h-80 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading products</h3>
              <p className="text-gray-500">{error}</p>
              <button 
                onClick={() => getProducts()}
                className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">We couldn't find any products matching your criteria.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-16">
                <button 
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold rounded-full hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Loading...' : 'Load More Products'}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-amber-900 to-orange-900 text-white mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-amber-100 mb-8">
            Be the first to know about new products, exclusive offers, and hair care tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-amber-300"
            />
            <button className="px-8 py-3 bg-white text-amber-900 font-semibold rounded-full hover:bg-amber-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </main>
  );
}