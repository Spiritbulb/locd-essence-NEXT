'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Product = {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  price: number | string;
  discount?: number;
  isNew?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const viewProductDetails = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/products/${product.slug}`);
  };

  const calculateDiscountedPrice = () => {
    if (product.discount && product.discount > 0) {
      const originalPrice = Number(product.price);
      const discountAmount = originalPrice * (product.discount / 100);
      return (originalPrice - discountAmount).toFixed(2);
    }
    return null;
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <article
      className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
      onClick={viewProductDetails}
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        {product.isNew && (
          <span className="bg-[#a38776] text-white text-[10px] px-1.5 py-0.5 rounded-full">
            New
          </span>
        )}
        {product.discount && product.discount > 0 && (
          <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Product Info - Compact layout */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-[#a38776] mb-1 line-clamp-2 h-10">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5">
          {discountedPrice ? (
            <>
              <span className="text-gray-900 font-semibold text-sm">Ksh{discountedPrice}</span>
              <span className="text-gray-500 text-xs line-through">Ksh{product.price}</span>
            </>
          ) : (
            <span className="text-gray-900 font-semibold text-sm">Ksh{product.price}</span>
          )}
        </div>

        <button
          onClick={viewProductDetails}
          className="mt-2 w-full py-1.5 bg-[#a38776] text-white rounded text-xs font-medium hover:bg-[#8a6e5d]"
        >
          View Details
        </button>
      </div>
    </article >
  );
}