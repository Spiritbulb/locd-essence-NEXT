"use client";
import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/utils/shopify';
import ProductCard from '@/components/ProductCard';
// @ts-ignore

interface ShopifyImage {
  url: string;
  altText: string | null;
}

interface ShopifyPrice {
  amount: string;
}

interface ShopifyVariant {
  id: string;
  price: ShopifyPrice;
  sku: string;
  availableForSale: boolean;
  title: string;
}

interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
}

interface ShopifyProductResponse {
  data?: {
    product?: ShopifyProductNode;
  };
  errors?: Array<{
    message: string;
  }>;
}

interface ShopifyProductsResponse {
  data?: {
    products?: {
      edges: Array<{
        node: ShopifyProductNode;
      }>;
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  altText: string;
  description: string;
  rating: number;
  reviews: number;
  stock: number;
  isNew: boolean;
  discount: number;
  category: string;
  inStock: boolean;
  sku: string;
  brand: string;
  details: string;
  images?: string[];
  variants?: ShopifyVariant[];
  descriptionHtml: string;
}

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [slug, setSlug] = useState<string>('');

  // Extract slug from params
  useEffect(() => {
    const getSlug = async () => {
      try {
        const resolvedParams = await params;
        const cleanSlug = resolvedParams.slug.replace(/^products\//, '');
        setSlug(cleanSlug);
      } catch (err) {
        console.error('Error resolving params:', err);
        setError('Invalid product URL');
        setLoading(false);
      }
    };
    
    getSlug();
  }, [params]);

  const getProduct = async (handle: string) => {
    if (!handle) return;
    
    setLoading(true);
    setError(null);

    const query = `
      query ($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          vendor
          productType
          tags
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                }
                sku
                availableForSale
              }
            }
          }
        }
      }
    `;

    try {
      //@ts-ignore
      const response = await client.request<ShopifyProductResponse>(query, { handle });
      
      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        throw new Error('Failed to fetch product');
      }
//@ts-ignore
      const productNode = response.data?.product;
      
      if (!productNode) {
        notFound();
        return;
      }

      const defaultImage = '/placeholder.jpg';
      //@ts-ignore
      const variants = productNode.variants.edges.map(({ node }) => node);
      //@ts-ignore
      const images = productNode.images.edges.map(({ node }) => node);
//@ts-ignore
      const productData: Product = {
        id: productNode.id,
        slug: productNode.handle,
        name: productNode.title,
        price: parseFloat(variants[0]?.price.amount || '0'),
        image: images[0]?.url || defaultImage,
        altText: images[0]?.altText || productNode.title,
        description: productNode.description,
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 5,
        stock: Math.floor(Math.random() * 30) + 5,
        isNew: productNode.tags.includes('new'),
        discount: productNode.tags.includes('sale') ? Math.floor(Math.random() * 30) + 10 : 0,
        category: productNode.productType || 'Hair Care',
        //@ts-ignore
        inStock: variants.some(v => v.availableForSale),
        sku: variants[0]?.sku || '',
        brand: productNode.vendor || "Loc'd Essence",
        details: productNode.description,
        //@ts-ignore
        images: images.map(img => img.url),
        variants: variants,
        descriptionHtml: productNode.descriptionHtml,
      };

      setProduct(productData);
      
      // Fetch related products
      await getRelatedProducts(productNode.productType);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRelatedProducts = async (productType: string) => {
    const query = `
      query ($productType: String!) {
        products(first: 4, query: $productType) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    price {
                      amount
                    }
                    sku
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      //@ts-ignore
      const response = await client.request<ShopifyProductsResponse>(query, { productType });
      
      if (response.errors) {
        console.error('GraphQL Errors:', response.errors);
        return;
      }
//@ts-ignore
      const edges = response.data?.products?.edges ?? [];
      //@ts-ignore
      const products = edges.map(({ node }) => {
        const defaultImage = '/placeholder.jpg';
        const primaryVariant = node.variants.edges[0]?.node;
        const primaryImage = node.images.edges[0]?.node;

        return {
          id: node.id,
          slug: node.handle,
          name: node.title,
          price: parseFloat(primaryVariant?.price.amount || '0'),
          image: primaryImage?.url || defaultImage,
          altText: primaryImage?.altText || node.title,
          description: node.description,
          rating: 4.5,
          reviews: Math.floor(Math.random() * 50) + 5,
          stock: Math.floor(Math.random() * 30) + 5,
          isNew: Math.random() > 0.7,
          discount: Math.random() > 0.8 ? Math.floor(Math.random() * 30) + 10 : 0,
          category: 'Hair Care',
          inStock: true,
          sku: primaryVariant?.sku || '',
          brand: "Loc'd Essence",
          details: node.description,
        };
        //@ts-ignore
      }).filter(p => p.slug !== slug); // Exclude current product

      setRelatedProducts(products.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  // Fetch product when slug is available
  useEffect(() => {
    if (slug) {
      getProduct(slug);
    }
  }, [slug]);

  const handleAddToCart = () => {
    // Add to cart functionality would be implemented here
    console.log('Add to cart:', {
      productId: product?.id,
      variantId: product?.variants?.[selectedVariant]?.id,
      quantity
    });
    // You could show a toast notification or update cart state
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="bg-gray-200 rounded-2xl h-96"></div>
                <div className="flex gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-20 w-20"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The product you are looking for could not be found.'}</p>
          <Link 
            href="/products"
            className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const currentPrice = product.variants?.[selectedVariant]?.price?.amount 
    ? parseFloat(product.variants[selectedVariant].price.amount)
    : product.price;

  const discountedPrice = product.discount > 0 
    ? currentPrice * (1 - product.discount / 100)
    : currentPrice;

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-orange-50/30">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-amber-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </nav>

      {/* Product Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl overflow-hidden">
              <Image
                src={product.images?.[selectedImage] || product.image}
                alt={product.altText}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{product.discount}%
                </div>
              )}
              {product.isNew && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  New
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImage ? 'border-amber-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-amber-600 font-medium mb-2">{product.brand}</p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ${currentPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Variant
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(index)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        index === selectedVariant
                          ? 'border-amber-500 bg-amber-50 text-amber-700'
                          : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} in stock
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  product.inStock
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <div className="flex space-x-4">
                <button className="flex-1 py-3 px-6 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Add to Wishlist
                </button>
                <button className="py-3 px-6 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
              <dl className="space-y-2">
                <div className="flex">
                  <dt className="text-sm text-gray-500 w-20">SKU:</dt>
                  <dd className="text-sm text-gray-900">{product.sku}</dd>
                </div>
                <div className="flex">
                  <dt className="text-sm text-gray-500 w-20">Category:</dt>
                  <dd className="text-sm text-gray-900">{product.category}</dd>
                </div>
                <div className="flex">
                  <dt className="text-sm text-gray-500 w-20">Brand:</dt>
                  <dd className="text-sm text-gray-900">{product.brand}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}