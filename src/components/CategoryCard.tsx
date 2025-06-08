'use client';

import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import styles from './CategoryCard.module.css';


interface CategoryCardProps {
  product: Category;
}

export default function CategoryCard({ product }: CategoryCardProps) {
  const router = useRouter();

  const viewProductDetails = (productId: string) => {
    try {
      router.push(`/products/${productId}`);
    } catch (error) {
      console.error('Routing error:', error);
      router.push('/');
    }
  };

  return (
    <article
      className={styles.categoryCard}
      aria-labelledby={`category-title-${product.id}`}
    >
      {/* Visual overlay effects */}
      <div className={styles.visualEffects}>
        <div className={styles.gradientOverlay} />
        <div className={styles.hoverOverlay} />
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
        <h3
          id={`category-title-${product.id}`}
          className={styles.categoryTitle}
        >
          {product.name}
        </h3>
        <p className={styles.productPrice}>Ksh{product.price}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            viewProductDetails(product.id);
          }}
          className={styles.exploreButton}
        >
          <span>View Details</span>
          {/* Optional arrow icon if desired */}
          <svg
            className={styles.arrowIcon}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </article>
  );
}
