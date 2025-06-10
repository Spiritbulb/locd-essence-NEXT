"use client";
import React, { useState, useEffect } from 'react';
import { Star, ShoppingBag, Heart, ArrowRight, Sparkles, Crown, Gem } from 'lucide-react';
import  ProductCard  from '@/components/ProductCard';
import  CategoryCard  from '@/components/CategoryCard';
import { Product, Category } from '@/types';



export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      id: '1',
      name: 'Moisture Rich Shampoo',
      slug: 'moisture-rich-shampoo',
      price: 29.99,
      description: 'Hydrating shampoo for natural hair with organic botanicals',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80',
      category: 'hair-care',
      stock: 50,
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Curl Defining Cream',
      slug: 'curl-defining-cream',
      price: 49.99,
      description: 'Perfect definition for your curls with long-lasting hold',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
      category: 'styling',
      stock: 30,
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Scalp Treatment Oil',
      slug: 'scalp-treatment-oil',
      price: 19.99,
      description: 'Nourishing oil blend for optimal scalp health',
      image: 'https://images.unsplash.com/photo-1595341595379-cf0ff033ce7b?auto=format&fit=crop&w=600&q=80',
      category: 'scalp-care',
      stock: 45,
      rating: 4.7,
    },
    {
      id: '4',
      name: 'Golden Hair Crown',
      slug: 'golden-hair-crown',
      price: 89.99,
      description: 'Handcrafted golden hair jewelry for special occasions',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      category: 'jewelry',
      stock: 15,
      rating: 5.0,
    },
    {
      id: '5',
      name: 'Beaded Hair Clips Set',
      slug: 'beaded-hair-clips-set',
      price: 34.99,
      description: 'Set of 6 African-inspired beaded hair accessories',
      image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=600&q=80',
      category: 'accessories',
      stock: 25,
      rating: 4.8,
    },
    {
      id: '6',
      name: 'Statement Earrings',
      slug: 'statement-earrings',
      price: 65.99,
      description: 'Bold brass earrings celebrating African heritage',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80',
      category: 'jewelry',
      stock: 20,
      rating: 4.9,
    },
  ];

  const categories = [
    {
      id: '1',
      name: 'Hair Care Essentials',
      image: 'https://images.unsplash.com/photo-1608248543803-ba9f8a322136?auto=format&fit=crop&w=600&q=80',
      description: 'Premium products for your daily hair care routine',
    },
    {
      id: '2',
      name: 'Luxury Jewelry',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&q=80',
      description: 'Handcrafted pieces that celebrate your beauty',
    },
    {
      id: '3',
      name: 'Hair Accessories',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
      description: 'Beautiful accessories to complete your look',
    },
  ];

  const testimonials = [
    {
      name: "Austin M.",
      location: "Nakuru, Kenya",
      text: "The curl cream transformed my hair! And the golden hair crown made me feel like royalty at my wedding.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5
    },
    {
      name: "Tasha Williams",
      location: "Lagos, Nigeria", 
      text: "Finally found products that work with my 4C hair. The jewelry pieces are absolutely stunning!",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      rating: 5
    },
    {
      name: "Keisha Brown",
      location: "Houston, TX",
      text: "The quality is unmatched. From hair care to jewelry, everything exceeds expectations!",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
      rating: 5
    }
  ];

  const heroSlides = [
    {
      title: "Crown Your Natural Beauty",
      subtitle: "Discover premium hair care and luxury jewelry crafted for you",
      buttonText: "Shop Collection",
      image: "https://images.unsplash.com/photo-1594736797933-d0eb8306c9e3?auto=format&fit=crop&w=1200&q=80",
      accent: "New Arrivals"
    },
    {
      title: "Handcrafted Jewelry",
      subtitle: "Celebrate your heritage with our stunning jewelry collection",
      buttonText: "Explore Jewelry",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
      accent: "Limited Edition"
    },
    {
      title: "Natural Hair Care",
      subtitle: "Nourish your crown with products made for natural hair",
      buttonText: "Shop Hair Care",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
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
    { text: "Free Shipping on Orders Over $50", icon: "🚚" },
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
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
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
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
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

      {/* Featured Products with Enhanced Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Categories */}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => (
              <CategoryCard key={category.id} product={category} />
            ))}
          </div>
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