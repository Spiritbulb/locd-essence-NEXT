"use client";

import { useRouter } from 'next/navigation';
import { CSSProperties } from 'react';

type Product = {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  price: number | string;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const router = useRouter();

  const viewProductDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      router.push(`/products/${product.slug}`);
    } catch (error) {
      console.error('Routing error:', error);
      router.push('/');
    }
  };

  // Define reusable style variables
  const styles = {
    card: {
      '--card-padding': '1.25rem',
      '--transition-duration': '300ms',
      '--transition-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
      '--primary-color': '#a38776',
      '--primary-hover': '#8a6e5d',
    } as CSSProperties,
    gradientOverlay: {
      background: 'linear-gradient(to top right, rgba(226, 196, 174, 0.6), rgba(255, 230, 232, 0.4), rgba(255, 255, 255, 0.2))',
    } as CSSProperties,
  };

  return (
    <article
      className="group relative min-w-[220px] h-80 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:shadow-lg"
      style={styles.card}
      aria-labelledby={`category-title-${product.id}`}
    >
      {/* Visual overlay effects */}
      <div className="absolute inset-0 z-10">
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"
          style={styles.gradientOverlay}
        ></div>
        <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:opacity-100"></div>
      </div>

      {/* Category image */}
      <div className="relative w-full h-72 overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105 group-hover:brightness-105"
          loading="lazy"
          width={280}
          height={280}
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
          onClick={viewProductDetails}
          className="px-7 py-2 bg-[#a38776] text-white rounded-full text-sm font-medium shadow-sm transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-[#8a6e5d] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-1.5 border-none cursor-pointer"
          type="button"
        >
          <span>View Details</span>
        </button>
      </div>
    </article>
  );
}