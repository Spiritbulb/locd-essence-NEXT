"use client";

import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import Image from 'next/image';

interface CategoryCardProps {
  product: Category;
}

export default function CategoryCard({ product }: CategoryCardProps) {
  const router = useRouter();

  const viewProductDetails = (productId: string) => {
    try {
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error('Routing error:', error);
      router.push('/');
    }
  };

  // Style variables
  const styles = {
    gradientOverlay: {
      background: 'linear-gradient(to top right, rgba(226, 196, 174, 0.6), rgba(255, 230, 232, 0.4), rgba(255, 255, 255, 0.2))',
    } as React.CSSProperties,
  };

  return (
    <article
      className="group relative min-w-[220px] h-80 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:shadow-lg"
      aria-labelledby={`category-title-${product.id}`}
    >
      {/* Visual overlay effects */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
          style={styles.gradientOverlay}
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100" />
      </div>

      {/* Category image */}
      <div className="relative w-full h-44 overflow-hidden rounded-t-xl">
        <Image
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
          width={280}
          height={280}
          quality={85}
        />
      </div>

      {/* Content section */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col items-center z-20">
        <h3
          id={`category-title-${product.id}`}
          className="text-lg font-semibold text-[#a38776] mb-3 text-center w-full truncate"
        >
          {product.name}
        </h3>
        <p className="text-base text-gray-700 my-2 font-medium">Ksh{product.price}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            viewProductDetails(product.id);
          }}
          className="px-7 py-2 bg-[#a38776] text-white rounded-full text-sm font-medium shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#8a6e5d] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5"
        >
          <span>View Details</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-x-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}