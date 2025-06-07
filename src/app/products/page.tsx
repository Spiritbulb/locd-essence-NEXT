// src/app/products/page.tsx
import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

async function getProducts(): Promise<Product[]> {
  // Replace with actual API call
  return [
    {
      id: '1',
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
      brand: 'Loc\'d Essence',
      details: 'Enriched with argan oil...',
      slug: 'premium-hair-oil'
    },
    // Add more products...
  ];
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
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