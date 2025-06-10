'use client';
import { useState } from 'react';
import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard'; // Adjust import path as needed

type Product = {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  price: number | string;
  discount?: number;
  isNew?: boolean;
  rating: number;
  stock: number;
  description: string;
  category: string;
};

const AccessoriesPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock product data matching your Product type
  const accessories: Product[] = [
    {
      id: 1,
      name: 'Gold Hair Cuffs',
      image: '/gold-cuffs.jpg',
      slug: 'gold-hair-cuffs',
      price: 24.99,
      isNew: true,
      rating: 4.8,
      stock: 15,
      description: 'Elegant gold-plated cuffs for styling locs',
      category: 'Hair Jewelry',
    },
    {
      id: 2,
      name: 'Bamboo Hair Clips',
      image: '/bamboo-clips.jpg',
      slug: 'bamboo-hair-clips',
      price: 12.99,
      rating: 4.5,
      stock: 22,
      description: 'Natural bamboo clips for gentle hold',
      category: 'Hair Accessories',
    },
    // ... other products
  ];

  // Filter products by category & search
  const filteredProducts = accessories.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Categories for filtering
  const categories = ['All', 'Hair Jewelry', 'Hair Accessories', 'Night Protection', 'Hair Protection', 'Hair Tools'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] py-16 text-white text-center">
        <h1 className="text-4xl font-bold mb-2">Hair Accessories</h1>
        <p className="text-lg opacity-90">Elevate your locs with our premium hair jewelry & care essentials</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Category Tabs (Mobile: Dropdown) */}
          <div className="w-full md:w-auto">
            <div className="md:hidden">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <Filter size={16} />
                <span>{selectedCategory}</span>
                {isFilterOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {isFilterOpen && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 rounded-md ${
                        selectedCategory === cat ? 'bg-[#8a6e5d]/10 text-[#8a6e5d]' : 'hover:bg-gray-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-[#8a6e5d] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search accessories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a6e5d]/20 focus:border-[#8a6e5d]/30"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found. Try adjusting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesPage;