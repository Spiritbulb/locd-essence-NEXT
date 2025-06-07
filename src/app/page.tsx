'use client';

import Link from 'next/link';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { Product, Category } from '../types';
import { useRouter } from 'next/navigation';
import { Button } from '../components/ui/Button';
import styles from '../components/homepage.module.css';

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

  const router = useRouter();

  const handleProductsClick = () => {
    router.push('/products');
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome to Loc'd Essence</h1>
          <p className={styles.heroSubtitle}>
            Discover the best products at unbeatable prices!
          </p>
          <Button
            onClick={handleProductsClick}
            className={styles.shopButton}
          >
            <span className={styles.shopButtonText}>Shop Now</span>
          </Button>
        </div>
      </header>

      {/* Scrolling Hero Banner */}
      <section className={styles.scrollingHero}>
        <div className={styles.scrollingHeroContainer}>
          {scrollingHeroItems.map((item, index) => (
            <div key={index} className={styles.scrollingHeroItem}>
              <div
                className={styles.scrollingHeroImage}
                style={{ backgroundImage: `url(${item.image})` }}
              >
                <div className={styles.scrollingHeroOverlay}></div>
                <div className={styles.scrollingHeroContent}>
                  <h2 className={styles.heroTitle}>{item.title}</h2>
                  <p className={styles.heroSubtitle}>{item.subtitle}</p>
                  <Button className={styles.shopButton}>
                    <span className={styles.shopButtonText}>{item.buttonText}</span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>Our Bestsellers</h2>
          </div>
          <div className={styles.productGrid}>
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-[rgba(61,0,0,0.6)]">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2 className="text-white">Categories</h2>
          </div>
          <div className={styles.productGrid}>
            {categories.map(category => (
              <CategoryCard key={category.id} product={category} {...category} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2>What Customers Say</h2>
          </div>
          <div className={styles.productGrid}>
            {testimonials.map(({ name, location, text, avatar }, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <img
                    src={avatar}
                    alt={name}
                    className={styles.testimonialAvatar}
                  />
                  <div className={styles.testimonialAuthor}>
                    <p className={styles.testimonialAuthorName}>{name}</p>
                    <p className={styles.testimonialAuthorLocation}>{location}</p>
                  </div>
                </div>
                <p className={styles.testimonialText}>&quot;{text}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling Text Banner */}
      <section className={styles.scrollingBanner}>
        <div className={styles.scrollingContent}>
          {scrollingItems.map((item, index) => (
            <span key={index} className={styles.scrollingItem}>
              {item.text}
            </span>
          ))}
        </div>
      </section>

      {/* Hair Care Tips */}
      <section className={`py-16 ${styles.container}`}>
        <div className={styles.sectionHeading}>
          <h2>Natural Hair Care Facts & Tips</h2>
        </div>
        <div className={styles.productGrid}>
          {hairTips.map(({ title, fact }, idx) => (
            <article key={idx} className={styles.hairTipCard}>
              <h3 className={styles.hairTipTitle}>{title}</h3>
              <p>{fact}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Meet the Creator */}
      <section className={styles.creatorSection}>
        <div className={`${styles.container} ${styles.creatorContainer}`}>
          <div className={styles.creatorContent}>
            <h2 className={styles.creatorTitle}>Meet the Creator</h2>
            <p className={styles.creatorDescription}>
              A Message From Our Founder

              "Welcome to Loc'd Essence – where crowns are nurtured, beauty is celebrated, and community thrives.
              WRITE MESSAGE

              This isn’t just commerce – it’s a reclamation. Every purchase supports Black artisans across Africa and its diaspora.
            </p>
            <Button className={styles.shopButton} onClick={handleLoginClick}>
              <span className={styles.shopButtonText}>JOIN US</span>
            </Button>
          </div>
          <div className={styles.creatorImageContainer}>
            <img
              src="/creator.png"
              alt="Founder of Locd Essence"
              className={styles.creatorImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}