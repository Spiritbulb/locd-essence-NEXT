// src/app/products/page.tsx
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

async function getProducts(): Promise<Product[]> {
  // Replace with actual API call
  return [
    {
      id: '1',
      slug: 'premium-hair-oil',
      name: 'Premium Hair Oil',
      price: 24.99,
      image: '/Jewelry.jpeg',
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
      image: '/charm.jpeg',
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
    // Add more products...
  ];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4 py-8 margin-16 padding-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold margin-16 padding-16">Our Products</h1>
        <div className="text-sm text-gray-500">
          Showing {products.length} products
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}