"use client";

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  product: {
    id: string;
    name: string;
    title: string;
    handle: string;
    image: string;
    altText?: string;
    description: string;
    price?: number;
    slug: string;
    category: string;
  };
}

export default function CategoryCard({ product }: CategoryCardProps) {
  const router = useRouter();

  const handleCategoryClick = () => {
    // Navigate to collection page using the handle/slug
    router.push(`/collections/${product.handle || product.slug}`);
  };

  const formatPrice = (price?: number) => {
    if (!price || price === 0) return '';
    return `From KSh ${price.toLocaleString()}`;
  };

  return (
    <div 
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onClick={handleCategoryClick}
    >
      <div className="relative h-80">
        <img
          src={product.image}
          alt={product.altText || product.name || product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            // Fallback image if the collection image fails to load
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">
            {product.title || product.name}
          </h3>
          <p className="text-white/90 mb-2 line-clamp-2">
            {product.description}
          </p>
          {product.price && product.price > 0 && (
            <p className="text-white/80 text-sm mb-4 font-medium">
              {formatPrice(product.price)}
            </p>
          )}
          <button className="self-start px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2 group-hover:bg-white/40">
            Explore {product.category}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Add a subtle hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#8a6e5d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}