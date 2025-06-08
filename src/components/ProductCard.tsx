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
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {product.isNew && (
          <span className="bg-[#a38776] text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        )}
        {product.discount && product.discount > 0 && (
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative w-full aspect-square overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#a38776] mb-1 truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          {discountedPrice ? (
            <>
              <span className="text-gray-900 font-bold">Ksh{discountedPrice}</span>
              <span className="text-gray-500 text-sm line-through">Ksh{product.price}</span>
            </>
          ) : (
            <span className="text-gray-900 font-bold">Ksh{product.price}</span>
          )}
        </div>

        <button
          onClick={viewProductDetails}
          className="mt-3 w-full py-2 bg-[#a38776] text-white rounded-md text-sm font-medium transition-colors duration-300 hover:bg-[#8a6e5d]"
        >
          View Details
        </button>
      </div>
    </article>
  );
}