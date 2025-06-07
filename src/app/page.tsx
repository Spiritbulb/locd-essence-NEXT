import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { Product, Category } from '../types';

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

  const scrollingHeroItems = [
    {
      title: "Latest Collection",
      subtitle: "New arrivals to check out",
      buttonText: "Explore",
      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Hair Charms",
      subtitle: "Style up your hair needs",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Limited Edition",
      subtitle: "Exclusive products while they last",
      buttonText: "Shop Now",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    }
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

  return (
    <div className="homepage">
      {/* Hero Section */}
      <header className="relative h-[90vh] min-h-[600px] bg-[url('https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80')] bg-cover bg-center flex items-center justify-center text-white text-center">
        <div className="absolute inset-0 bg-[rgba(61,0,0,0.6)]"></div>
        <div className="relative z-10 animate-fadeInUp">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-shadow-lg">Welcome to Loc'd Essence</h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-shadow">
            Discover the best products at unbeatable prices!
          </p>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center px-12 py-4 bg-accent text-white font-semibold rounded-full shadow-lg hover:bg-accent-dark transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            Shop Now
            <span className="ml-2">→</span>
          </Link>
        </div>
      </header>

      {/* Scrolling Hero Banner */}
      <section className="relative h-[30vh] min-h-[400px] overflow-hidden">
        <div className="flex h-full w-[700%] animate-scrollLeft">
          {scrollingHeroItems.map((item, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <div 
                className="w-full h-full bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(62,39,35,0.7)] to-[rgba(109,76,65,0.5)]"></div>
                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-shadow">{item.title}</h2>
                  <p className="text-xl mb-6 text-shadow">{item.subtitle}</p>
                  <button className="bg-accent text-white px-8 py-3 rounded-full font-medium hover:bg-accent-dark transition">
                    {item.buttonText}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-accent after:rounded">
              Our Bestsellers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[rgba(61,0,0,0.6)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-accent after:rounded text-white">
              Categories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map(category => (
              <CategoryCard product={category} key={category.id} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold mb-12">What Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(({ name, location, text, avatar }, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <img 
                    src={avatar} 
                    alt={name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-500">{location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">&quot;{text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling Text Banner */}
      <section className="overflow-hidden whitespace-nowrap bg-accent text-white py-4 text-lg font-semibold tracking-wide">
        <div className="inline-block animate-scrollRight">
          {scrollingItems.map((item, index) => (
            <span key={index} className="mx-12">
              {item.text}
            </span>
          ))}
        </div>
      </section>

      {/* Hair Care Tips */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-12">Natural Hair Care Facts & Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {hairTips.map(({ title, fact }, idx) => (
            <article key={idx} className="p-6 border rounded-lg shadow-sm hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-4">{title}</h3>
              <p>{fact}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Meet the Creator */}
      <section className="bg-gray-900 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-6">Meet the Creator</h2>
            <p className="mb-6 max-w-lg leading-relaxed">
              Hello! I'm the founder of Loc'd Essence, passionate about empowering natural hair care in Africa. Thank you for supporting our small business!
            </p>
            <Link
              href="/about"
              className="inline-block px-8 py-3 bg-accent rounded-full font-semibold hover:bg-accent-dark transition"
            >
              Learn More
            </Link>
          </div>
          <div className="md:w-1/2 max-w-md">
            <img 
              src="/creator.png" 
              alt="Founder of Locd Essence" 
              className="w-full h-auto object-cover rounded-lg transition-transform hover:scale-105"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
