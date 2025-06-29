"use client";
import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Heart, ArrowRight, Sparkles, Crown, Gem } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { Product, Category } from '@/types';
import { client } from '@/lib/utils/shopify';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [collectionsLoading, setCollectionsLoading] = useState(true);

  // Fetch Featured Collection Products
  const fetchFeaturedProducts = async () => {
    try {
      setError(null);
      setLoading(true);

      const response = await client.request(`
        {
          collection(handle: "featured") {
            id
            title
            products(first: 8) {
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
        }
      `);

      if (response.data.collection) {
        setFeaturedProducts(response.data.collection.products?.edges || []);
      } else {
        // Fallback to all products if Featured collection doesn't exist
        const fallbackResponse = await client.request(`
          {
            products(first: 8) {
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
        setFeaturedProducts(fallbackResponse.data.products?.edges || []);
      }
    } catch (err: any) {
      console.error('Error fetching featured products:', err);
      setError(err.message || 'Failed to fetch featured products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch Collections for Category Section
  const fetchCollections = async () => {
    try {
      setCollectionsLoading(true);

      const response = await client.request(`
        {
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
                description
                image {
                  url(transform: { maxWidth: 600, maxHeight: 400 })
                  altText
                }
                products(first: 1) {
                  edges {
                    node {
                      id
                      priceRange {
                        minVariantPrice {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `);

      // Filter out the Featured collection from the category section
      const filteredCollections = response.data.collections?.edges.filter(
        (edge: any) => edge.node.handle !== 'featured'
      ) || [];

      setCollections(filteredCollections.slice(0, 3)); // Show max 3 collections
    } catch (err: any) {
      console.error('Error fetching collections:', err);
    } finally {
      setCollectionsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
    fetchCollections();
  }, []);

  const testimonials = [
    {
      name: "Annie M.",
      location: "Nakuru, Kenya",
      text: "The curl cream transformed my hair! And the golden hair crown made me feel like royalty at my wedding.",
      avatar: "https://plus.unsplash.com/premium_photo-1745624797647-37ddb5c77b65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGUlMjBhZnJpY2FuJTIwd29tZW58ZW58MHx8MHx8fDA%3D",
      rating: 5
    },
    {
      name: "Tasha W",
      location: "Lagos, Nigeria",
      text: "Finally found products that work with my 4C hair. The jewelry pieces are absolutely stunning!",
      avatar: "https://images.unsplash.com/photo-1744040866587-e3ac6dcde112?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHVzZXIlMjBwcm9maWxlJTIwYWZyaWNhbiUyMHdvbWVufGVufDB8fDB8fHww",
      rating: 5
    },
    {
      name: "Keisha B",
      location: "Houston, TX",
      text: "The quality is unmatched. From hair care to jewelry, everything exceeds expectations!",
      avatar: "https://images.unsplash.com/photo-1602177281687-c8900253495b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHVzZXIlMjBwcm9maWxlJTIwYWZyaWNhbiUyMHdvbWVufGVufDB8fDB8fHww",
      rating: 5
    }
  ];

  const heroSlides = [
    {
      title: "Crown Your Natural Beauty",
      subtitle: "Discover premium hair care and luxury jewelry crafted for you",
      buttonText: "Shop Collection",
      image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      accent: "New Arrivals"
    },
    {
      title: "Handcrafted Jewelry",
      subtitle: "Celebrate your heritage with our stunning jewelry collection",
      buttonText: "Explore Jewelry",
      image: "https://images.unsplash.com/photo-1727947074642-0bd47ef70b58?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      accent: "Limited Edition"
    },
    {
      title: "Natural Hair Care",
      subtitle: "Nourish your crown with products made for natural hair",
      buttonText: "Shop Hair Care",
      image: "https://images.unsplash.com/photo-1540256817643-88ca55778eb6?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      accent: "Bestsellers"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollingItems = [
    { text: "Free Shipping on Orders Over KSh5000", icon: "🚚" },
    { text: "30-Day Money Back Guarantee", icon: "💰" },
    { text: "100% Natural Ingredients", icon: "🌿" },
    { text: "Handcrafted with Love in Kenya", icon: "🇰🇪" },
    { text: "Ethically Sourced Materials", icon: "✨" }
  ];

  const hairTips = [
    {
      title: "Deep Moisture",
      fact: "Natural hair thrives with the L.O.C. method: Liquid, Oil, Cream for maximum hydration and shine.",
      icon: <Sparkles className="w-8 h-8 text-[#8a6e5d]" />
    },
    {
      title: "Night Protection",
      fact: "Satin pillowcases and silk scarves reduce breakage by up to 45% while you sleep.",
      icon: <Crown className="w-8 h-8 text-[#8a6e5d]" />
    },
    {
      title: "Gentle Care",
      fact: "Detangle with care using wide-tooth combs and plenty of conditioner to prevent damage.",
      icon: <Gem className="w-8 h-8 text-[#8a6e5d]" />
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Enhanced Hero Section with Carousel */}
      <header className="relative w-full h-screen overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute inset-0">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
            </div>
            <div className="relative z-10 h-full flex items-center">
              <div className="max-w-7xl mx-auto px-6 w-full">
                <div className="max-w-2xl">
                  <div className="inline-block px-4 py-2 bg-[#8a6e5d]/20 backdrop-blur-sm border border-[#8a6e5d]/30 rounded-full text-white text-sm font-medium mb-6">
                    {slide.accent}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>
                  <button className="px-8 py-4 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-full font-semibold text-lg hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center gap-3">
                    {slide.buttonText}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                }`}
            />
          ))}
        </div>
      </header>

      {/* Enhanced Scrolling Banner */}
      <section className="w-full overflow-hidden bg-gradient-to-r from-[#8a6e5d] via-[#a38776] to-[#8a6e5d] text-white py-4">
        <div className="flex animate-scroll">
          {[...scrollingItems, ...scrollingItems].map((item, index) => (
            <div key={index} className="flex items-center gap-3 mx-8 whitespace-nowrap">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-lg font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#8a6e5d]/10 rounded-full text-[#8a6e5d] text-sm font-medium mb-4">
              Bestsellers
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Crown Favorites
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most loved hair care products and jewelry pieces
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a6e5d]"></div>
              <p className="mt-4 text-gray-600">Loading featured products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800 font-medium">Failed to load products</p>
                <p className="text-red-600 text-sm mt-2">{error}</p>
                <button 
                  onClick={fetchFeaturedProducts}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Product Cards Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((edge) => {
                const product = edge.node;
                const firstVariant = product.variants?.edges?.[0]?.node;
                const price =
                  firstVariant?.price?.amount ||
                  product.priceRange?.minVariantPrice?.amount ||
                  0;
                const stock = firstVariant?.quantityAvailable ?? 0;

                return (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.title,
                      handle: product.handle,
                      name: product.title,
                      description: product.description,
                      price: parseFloat(price),
                      discount: 0,
                      image: product.featuredImage?.url || '',
                      altText: product.featuredImage?.altText || product.title,
                      brand: product.productType,
                      variants: product.variants,
                      inStock: stock > 0,
                      stock: stock,
                      rating: 4,
                      reviews: 0,
                      isNew: false,
                      slug: product.handle,
                      category: product.productType || '',
                      sku: firstVariant?.id || product.id,
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* No Products State */}
          {!loading && !error && featuredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Collections Categories */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#8a6e5d]/20 rounded-full text-[#8a6e5d] text-sm font-medium mb-4">
              Collections
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From hair care essentials to statement jewelry pieces
            </p>
          </div>

          {/* Collections Loading State */}
          {collectionsLoading && (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#8a6e5d]"></div>
              <p className="mt-4 text-gray-300">Loading collections...</p>
            </div>
          )}

          {/* Collections Grid */}
          {!collectionsLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((edge) => {
                const collection = edge.node;
                const firstProduct = collection.products?.edges?.[0]?.node;
                const startingPrice = firstProduct?.priceRange?.minVariantPrice?.amount || 0;

                return (
                  <CategoryCard 
                    key={collection.id} 
                    product={{
                      id: collection.id,
                      name: collection.title,
                      title: collection.title,
                      handle: collection.handle,
                      description: collection.description || `Explore our ${collection.title} collection`,
                      image: collection.image?.url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
                      altText: collection.image?.altText || collection.title,
                      price: parseFloat(startingPrice),
                      slug: collection.handle,
                      category: collection.title,
                    }} 
                  />
                );
              })}
            </div>
          )}

          {/* No Collections State */}
          {!collectionsLoading && collections.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-300">No collections available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#8a6e5d]/10 rounded-full text-[#8a6e5d] text-sm font-medium mb-4">
              Reviews
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Customer Love
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers are saying about their experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, location, text, avatar, rating }, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">
                  "{text}"
                </p>
                <div className="flex items-center">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{name}</p>
                    <p className="text-gray-500 text-sm">{location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Hair Care Tips */}
      <section className="py-20 bg-gradient-to-r from-[#8a6e5d]/5 via-[#a38776]/5 to-[#8a6e5d]/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#8a6e5d]/10 rounded-full text-[#8a6e5d] text-sm font-medium mb-4">
              Expert Tips
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Natural Hair Wisdom
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional tips to help you maintain healthy, beautiful hair
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hairTips.map(({ title, fact, icon }, idx) => (
              <div key={idx} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#8a6e5d]/20">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-[#8a6e5d]/10 rounded-2xl group-hover:bg-[#8a6e5d]/20 transition-colors">
                    {icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 ml-4">{title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Meet the Creator */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#8a6e5d]/10 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block px-4 py-2 bg-[#8a6e5d]/20 rounded-full text-[#8a6e5d] text-sm font-medium mb-6">
                Our Story
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Meet the Creator
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-300">
                <p>
                  Welcome to Loc'd Essence – where crowns are nurtured, beauty is celebrated, and community thrives.
                </p>
                <p>
                  This isn't just commerce – it's a reclamation. Every purchase supports Black artisans across Africa and its diaspora, celebrating the rich heritage of natural hair care and handcrafted jewelry.
                </p>
                <p>
                  From premium hair care products formulated for natural textures to stunning jewelry pieces that tell our stories, every item is chosen with intention and crafted with love.
                </p>
              </div>
              <button className="mt-8 px-8 py-4 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white rounded-full font-semibold text-lg hover:from-[#7e4507] hover:to-[#8a6e5d] transition-all duration-300 shadow-2xl transform hover:-translate-y-1 flex items-center gap-3">
                Join Our Community
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-[#8a6e5d]/20 to-transparent rounded-3xl" />
              <img
                src="/creator.png"
                alt="Founder of Loc'd Essence"
                className="w-full h-auto rounded-3xl shadow-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1594736797933-d0eb8306c9e3?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}