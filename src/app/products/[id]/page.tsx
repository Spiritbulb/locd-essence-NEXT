
import { notFound } from 'next/navigation';
import { Product } from '@/types';

async function getProduct(id: string): Promise<Product | null> {
  try {
    // Replace with your actual data fetching logic
    const res = await fetch(`https://your-api.com/products/${id}`);

    if (!res.ok) {
      return null;
    }

    const product = await res.json();

    // Validate the product matches your type
    if (!product?.id || !product?.slug) {
      return null;
    }

    return product as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({
  params
}: {
  params: { id: string }
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound(); // This will show the 404 page
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            {/* Rating display */}
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.floor(product.rating) ? '★' : '☆'}
                </span>
              ))}
              <span className="ml-2 text-sm">({product.reviews} reviews)</span>
            </div>

            {/* Stock status */}
            <span className={`text-sm ${product.inStock ? 'text-green-600' : 'text-red-600'
              }`}>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {product.discount ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
                <span className="ml-2 text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                  {product.discount}% OFF
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          {/* Additional details */}
          {product.details && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p className="text-gray-700">{product.details}</p>
            </div>
          )}

          {/* Brand and SKU */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <span className="text-gray-500">Brand:</span>
              <span className="ml-2 font-medium">{product.brand}</span>
            </div>
            <div>
              <span className="text-gray-500">SKU:</span>
              <span className="ml-2 font-medium">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}