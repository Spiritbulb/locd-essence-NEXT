"use client";

import { useRouter } from 'next/navigation';
import styles from './ProductCard.module.css';

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

  return (
    <article
      className={`${styles.categoryCard} group`}
      aria-labelledby={`category-title-${product.id}`}
    >
      {/* Visual overlay effects */}
      <div className={styles.visualEffects}>
        <div className={styles.gradientOverlay}></div>
        <div className={styles.hoverOverlay}></div>
      </div>

      {/* Category image */}
      <div className={styles.imageContainer}>
        <img
          src={product.image}
          alt={product.name}
          className={styles.categoryImage}
          loading="lazy"
          width={280}
          height={280}
        />
      </div>

      {/* Content section */}
      <div className={styles.contentArea}>
        <h3 id={`category-title-${product.id}`} className={styles.categoryTitle}>
          {product.name}
        </h3>
        <p className={styles.productPrice}>Ksh{product.price}</p>
        <button
          onClick={viewProductDetails}
          className={styles.exploreButton}
          type="button"
        >
          <span>View Details</span>
        </button>
      </div>
    </article>
  );
}
