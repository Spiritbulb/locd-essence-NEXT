'use client';

import { useEffect, useState } from 'react';
import { Search, Loader2, Grid, List, ChevronDown, Package, Sparkles, Heart, Crown } from 'lucide-react';
import { client } from '@/lib/utils/shopify';
import CollectionsCard from '@/components/CollectionCard';
import React from 'react';

export const runtime = 'edge';

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filterOptions = ['All', 'Featured', 'New', 'Popular', 'A-Z'];
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'title-asc', label: 'A-Z' },
    { value: 'title-desc', label: 'Z-A' },
    { value: 'product-count', label: 'Most Products' },
    { value: 'updated', label: 'Recently Updated' }
  ];

  const fetchCollections = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await client.request(`
        {
          collections(first: 50) {
            edges {
              node {
                id
                title
                handle
                description
                updatedAt
                image {
                  url(transform: { maxWidth: 600, maxHeight: 400 })
                  altText
                }
                products(first: 1) {
                  edges {
                    node {
                      id
                    }
                  }
                }
                productsCount: products(first: 250) {
                  edges {
                    node {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      `);

      const collectionsWithCount = response.data.collections?.edges.map((edge: any) => ({
        ...edge.node,
        productCount: edge.node.productsCount?.edges?.length || 0
      })) || [];

      setCollections(collectionsWithCount);
    } catch (err: any) {
      console.error('Error fetching collections:', err);
      setError(err.message || 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#8a6e5d] animate-spin mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading our beautiful collections...</p>
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
                onClick={fetchCollections}
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

  // Filter and sort collections
  const filteredAndSortedCollections = collections
    .filter((collection: any) => {
      const matchesSearch =
        searchQuery === '' ||
        collection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilter = selectedFilter === 'All' || 
        (selectedFilter === 'Featured' && collection.productCount > 10) ||
        (selectedFilter === 'New' && new Date(collection.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
        (selectedFilter === 'Popular' && collection.productCount > 5);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'product-count':
          return b.productCount - a.productCount;
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
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
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-full">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Our <span className="text-[#8a6e5d]">Collections</span>
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explore our carefully curated collections of premium hair care, elegant jewelry, and beauty accessories
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
                  placeholder="Search collections..."
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30 transition-all duration-300" 
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {filterOptions.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedFilter(filter)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedFilter === filter
                        ? 'bg-[#8a6e5d] text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-[#8a6e5d]/10 hover:text-[#8a6e5d]'
                    }`}
                  >
                    {filter === 'Featured' && <Crown className="w-4 h-4" />}
                    {filter === 'New' && <Sparkles className="w-4 h-4" />}
                    {filter === 'Popular' && <Heart className="w-4 h-4" />}
                    {filter}
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

        {/* Collections Grid */}
        {filteredAndSortedCollections.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No collections found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 max-w-6xl mx-auto'
          }`}>
            {filteredAndSortedCollections.map((collection: any) => {
              // Determine if collection is new (updated in last 30 days)
              const isNew = new Date(collection.updatedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              // Determine if collection is featured (has more than 10 products)
              const isFeatured = collection.productCount > 10;

              return (
                <CollectionsCard
                  key={collection.id}
                  collection={{
                    id: collection.id,
                    handle: collection.handle,
                    title: collection.title,
                    description: collection.description,
                    image: collection.image?.url,
                    featuredImage: collection.image ? {
                      url: collection.image.url,
                      altText: collection.image.altText
                    } : undefined,
                    altText: collection.image?.altText,
                    productCount: collection.productCount,
                    isNew: isNew,
                    isFeatured: isFeatured,
                    updatedAt: collection.updatedAt
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Showing {filteredAndSortedCollections.length} of {collections.length} collections
            {selectedFilter !== 'All' && ` (${selectedFilter})`}
          </p>
        </div>

        {/* Featured Collections Stats */}
        {collections.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{collections.length}</h3>
              <p className="text-gray-600 text-sm">Total Collections</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {collections.reduce((sum, c) => sum + c.productCount, 0)}
              </h3>
              <p className="text-gray-600 text-sm">Total Products</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {collections.filter(c => c.productCount > 10).length}
              </h3>
              <p className="text-gray-600 text-sm">Featured Collections</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}