// src/app/products/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Product } from '@/types';

// Fetch all products (replace with your actual data fetching logic)
async function getAllProducts(): Promise<Product[]> {
  // Example: fetch from API or database
  // return fetch('/api/products').then(res => res.json());
  return []; // TODO: Replace with actual implementation
}

async function getProduct(slug: string): Promise<Product | null> {
  const products = await getAllProducts();
  return products.find(p => p.slug === slug) || null;
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const product = await getProduct(params.slug);
  if (!product) return notFound();

  const discountedPrice = product.discount 
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.isNew && (
            <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
              New Arrival
            </span>
          )}
          
          <h1 className="text-3xl font-bold">{product.name}</h1>
          
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < Math.floor(product.rating)} />
              ))}
            </div>
            <span className="text-gray-600">
              {product.rating.toFixed(1)} ({product.reviews} reviews)
            </span>
          </div>

          <div className="space-y-2">
            {discountedPrice ? (
              <>
                <span className="text-3xl font-bold text-red-600">
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className="text-lg text-gray-500 line-through ml-2">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-3xl font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
            <span className="text-sm text-gray-500">SKU: {product.sku}</span>
            <span className="text-sm text-gray-500">Brand: {product.brand}</span>
          </div>

          <p className="text-gray-700">{product.description}</p>

          {product.details && (
            <div className="pt-4 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-2">Product Details</h2>
              <p className="text-gray-700">{product.details}</p>
            </div>
          )}

          <button 
            className={`w-full py-3 px-6 rounded-lg font-medium ${product.inStock 
              ? 'bg-primary text-white hover:bg-primary-dark' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            disabled={!product.inStock}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </main>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}