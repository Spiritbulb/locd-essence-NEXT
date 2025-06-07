import { notFound } from 'next/navigation';
import { Product } from '@/types';

// Mock data for products
const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'premium-hair-oil',
    name: 'Premium Hair Oil',
    price: 24.99,
    image: '/products/hair-oil.jpg',
    description: 'Nourishing oil for all hair types',
    rating: 4.8,
    reviews: 128,
    stock: 50,
    isNew: true,
    discount: 10,
    category: 'hair-care',
    inStock: true,
    sku: 'PROD001',
    brand: "Loc'd Essence",
    details: 'Enriched with argan oil and vitamin E to nourish and strengthen hair. Suitable for all hair types. Free from parabens and sulfates.',
  },
  {
    id: '2',
    slug: 'moisturizing-shampoo',
    name: 'Moisturizing Shampoo',
    price: 19.99,
    image: '/products/shampoo.jpg',
    description: 'Gentle cleansing for dry hair',
    rating: 4.5,
    reviews: 95,
    stock: 30,
    isNew: false,
    discount: 0,
    category: 'hair-care',
    inStock: true,
    sku: 'PROD002',
    brand: "Loc'd Essence",
    details: 'Hydrating formula with coconut oil and shea butter. Sulfate-free and color-safe.',
  },
];

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockProducts.find(p => p.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
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