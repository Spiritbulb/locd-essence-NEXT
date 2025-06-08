'use client';

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { Product, Category } from '../types';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import FloatingMenu from '@/components/floatingbutton';

export default function Home() {
  // Mock data - replace with your actual data fetching
  const featuredProducts: Product[] = [
    {
      id: '1',
      name: 'Moisture Rich Shampoo',
      price: 29.99,
      description: 'Hydrating shampoo for natural hair',
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80',
      category: 'hair-care',
      stock: 50,
      rating: 4.8,
      slug: 'moisture-rich-shampoo',
      reviews: 0,
      inStock: false,
      sku: '',
      brand: ''
    },
    {
      id: '2',
      name: 'Curl Defining Cream',
      price: 49.99,
      description: 'Perfect definition for your curls',
      image: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80',
      category: 'styling',
      stock: 30,
      rating: 4.9,
      slug: 'curl-defining-cream',
      reviews: 0,
      inStock: false,
      sku: '',
      brand: ''
    },
    {
      id: '3',
      name: 'Scalp Treatment Oil',
      price: 19.99,
      description: 'Nourishing oil for scalp health',
      image: 'https://images.unsplash.com/photo-1595341595379-cf0ff033ce7b?auto=format&fit=crop&w=600&q=80',
      category: 'scalp-care',
      stock: 45,
      rating: 4.7,
      slug: 'scalp-treatment-oil',
      reviews: 0,
      inStock: false,
      sku: '',
      brand: ''
    },
  ];

  const categories: Category[] = [
    {
      id: '1',
      name: 'Care Essentials',
      slug: 'care-essentials',
      image: 'https://images.unsplash.com/photo-1608248543803-ba9f8a322136?auto=format&fit=crop&w=600&q=80',
      description: 'Products for daily hair care routine',
      productCount: 0,
      price: undefined
    },
    {
      id: '2',
      name: 'Hair Accessories',
      slug: 'hair-accessories',
      image: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80',
      description: 'Beautiful accessories for your hair',
      productCount: 0,
      price: undefined
    },
    {
      id: '3',
      name: 'Wraps & Scarves',
      slug: 'wraps-scarves',
      image: 'https://images.unsplash.com/photo-1590664863685-a99ef05e9f61?auto=format&fit=crop&w=600&q=80',
      description: 'Stylish wraps to protect your hair',
      productCount: 0,
      price: undefined
    },
  ];

  const testimonials = [
    {
      name: "Austin",
      location: "Nakuru, Kenya",
      text: "My curls have never looked better! The defining cream is a game changer.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Tasha Williams",
      location: "Lagos, Nigeria",
      text: "Finally found products that work with my 4C hair. My scalp has never been healthier.",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      name: "Keisha Brown",
      location: "Houston, TX",
      text: "The moisture shampoo saved my hair after years of damage. Worth every penny!",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    }
  ];

  const scrollingItems = [
    { text: "Free Shipping on Orders Over $50" },
    { text: "10-Day Money Back Guarantee" },
    { text: "100% Natural Ingredients" },
    { text: "Healthy Choices" },
    { text: "Made with Love in Kenya" }
  ];

  // Replace your scrollingHeroItems with this:
const scrollingHeroItems = [
  // Original items (3x)
  {
    title: "Latest Collection",
    subtitle: "New arrivals to check out",
    buttonText: "Explore",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Hair Charms",
    subtitle: "Style up your hair needs",
    buttonText: "Shop Now",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Limited Edition",
    subtitle: "Exclusive products while they last",
    buttonText: "Shop Now",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
  },
  // Clone the first item for seamless loop
  {
    title: "Latest Collection",
    subtitle: "New arrivals to check out",
    buttonText: "Explore",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80",
  },
];



  const hairTips = [
    {
      title: "Moisture",
      fact: "Natural hair needs water, not just oil! Try the L.O.C. method: Liquid (water), Oil, then Cream for maximum hydration."
    },
    {
      title: "Protection",
      fact: "Sleeping on satin or silk reduces breakage by 45% compared to cotton pillowcases."
    },
    {
      title: "Growth",
      fact: "Hair grows about 1/2 inch per month, but retaining length is about proper care, not just growth."
    }
  ];

  const router = useRouter();

  const handleProductsClick = () => {
    router.push('/products');
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

   return (
    <div className="w-full">
      {/* Hero Section */}
      <header className="relative w-full h-[90vh] min-h-[600px] bg-[url('https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-[rgba(61,0,0,0.6)]"></div>
        <div className="relative z-10 w-full px-4 animate-[fadeInUp_1s_ease]">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 drop-shadow-lg">Welcome to Loc'd Essence</h1>
            <p className="text-xl sm:text-2xl mb-10 max-w-3xl mx-auto drop-shadow">
              Discover the best products at unbeatable prices!
            </p>
            <Button
              onClick={handleProductsClick}
              className="px-6 py-2 bg-gradient-to-br from-[#7e4507] via-[#a38776] to-[#8a6e5d] text-white rounded-full transition-all duration-300 ease-in-out font-medium shadow-lg hover:from-[#c19660] hover:to-[#8a6e5d] hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="text-sm tracking-wider uppercase">Shop Now</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Featured Products*/}
      <section className="w-full py-12 sm:py-16 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 relative">
            <h2 className="text-2xl sm:text-3xl font-bold">Our Bestsellers</h2>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-[#a38776] rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories  */}
      <section className="w-full py-12 sm:py-16 bg-[rgba(61,0,0,0.6)]">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Categories</h2>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-[#a38776] rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {categories.map(category => (
              <CategoryCard key={category.id} product={category} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-12 sm:py-16 bg-gray-100">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 relative">
            <h2 className="text-2xl sm:text-3xl font-bold">What Customers Say</h2>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-[#a38776] rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map(({ name, location, text, avatar }, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 sm:p-6 shadow-md">
                <div className="flex items-center mb-3 sm:mb-4">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                  <div className="ml-3 sm:ml-4">
                    <p className="text-sm sm:text-base font-semibold">{name}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{location}</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-600 italic">&quot;{text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling Text Banner */}
      <section className="w-full overflow-hidden whitespace-nowrap bg-[#a38776] text-white py-3 sm:py-4 text-sm sm:text-lg font-semibold tracking-wide">
        <div className="inline-block animate-[scrollRight_20s_linear_infinite]">
          {scrollingItems.map((item, index) => (
            <span key={index} className="mx-6 sm:mx-12 inline-block">
              {item.text}
            </span>
          ))}
        </div>
      </section>

      {/* Hair Care Tips */}
      <section className="w-full py-12 sm:py-16">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 relative">
            <h2 className="text-2xl sm:text-3xl font-bold">Natural Hair Care Facts & Tips</h2>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 sm:w-20 h-1 bg-[#a38776] rounded"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {hairTips.map(({ title, fact }, idx) => (
              <article key={idx} className="p-4 sm:p-6 border border-gray-200 rounded-lg shadow-sm transition-shadow hover:shadow-md">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{title}</h3>
                <p className="text-sm sm:text-base">{fact}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="w-full py-12 sm:py-20 bg-gray-900 text-white">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 sm:mb-6">Meet the Creator</h2>
              <p className="mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base max-w-2xl">
                A Message From Our Founder
                <br /><br />
                "Welcome to Loc'd Essence – where crowns are nurtured, beauty is celebrated, and community thrives.
                <br /><br />
                This isn't just commerce – it's a reclamation. Every purchase supports Black artisans across Africa and its diaspora.
              </p>
              <Button 
                onClick={handleLoginClick}
                className="px-4 sm:px-6 py-1 sm:py-2 bg-gradient-to-br from-[#7e4507] via-[#a38776] to-[#8a6e5d] text-white rounded-full transition-all duration-300 ease-in-out font-medium shadow-lg hover:from-[#c19660] hover:to-[#8a6e5d] hover:shadow-xl hover:-translate-y-0.5"
              >
                <span className="text-xs sm:text-sm tracking-wider uppercase">JOIN US</span>
              </Button>
            </div>
            <div className="flex-1 max-w-xl">
              <img
                src="/creator.png"
                alt="Founder of Locd Essence"
                className="w-full h-auto rounded-lg transition-transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <FloatingMenu />
    </div>
  );
}