// src/components/CollectionsCard.tsx

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Collection = {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  altText?: string;
  productCount?: number;
  isNew?: boolean;
  isFeatured?: boolean;
  updatedAt?: string;
};

type CollectionsCardProps = {
  collection: Collection;
};

export default function CollectionsCard({ collection }: CollectionsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Create the collection URL using handle
  const collectionUrl = `/collections/${collection.handle}`;

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-[#7e4507]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Collection Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {collection.isNew && (
          <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full shadow-lg">
            New
          </span>
        )}
        {collection.isFeatured && (
          <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg">
            Featured
          </span>
        )}
        {collection.productCount && collection.productCount > 0 && (
          <span className="px-3 py-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white text-xs font-semibold rounded-full shadow-lg">
            {collection.productCount} {collection.productCount === 1 ? 'item' : 'items'}
          </span>
        )}
      </div>

      {/* Collection Image */}
      <Link href={collectionUrl} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
          <Image
            src={collection.image || collection.featuredImage?.url || '/placeholder-collection.jpg'}
            alt={collection.altText || collection.featuredImage?.altText || collection.title}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-amber-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Overlay on hover */}
          <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          {/* Collection Title Overlay */}
          <div className="absolute inset-0 flex items-end justify-start p-6">
            <div className={`transition-all duration-300 ${
              isHovered ? 'transform translate-y-0 opacity-100' : 'transform translate-y-2 opacity-80'
            }`}>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                {collection.title}
              </h3>
              {collection.description && (
                <p className={`text-white/90 text-sm line-clamp-2 transition-all duration-300 ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  {collection.description}
                </p>
              )}
            </div>
          </div>
          
          {/* Explore Button */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-amber-50 transition-colors shadow-lg">
              Explore Collection
            </button>
          </div>
        </div>
      </Link>

      {/* Collection Info */}
      <div className="p-6">
        {/* Collection Title (for mobile/accessibility) */}
        <Link href={collectionUrl}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-amber-600 transition-colors lg:hidden">
            {collection.title}
          </h3>
        </Link>

        {/* Description */}
        {collection.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {collection.description}
          </p>
        )}

        {/* Collection Stats */}
        <div className="flex items-center justify-between mb-4">
          {collection.productCount !== undefined && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm text-gray-600">
                {collection.productCount} {collection.productCount === 1 ? 'Product' : 'Products'}
              </span>
            </div>
          )}
          
          {collection.updatedAt && (
            <span className="text-xs text-gray-400">
              Updated {new Date(collection.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Explore Button */}
        <Link href={collectionUrl}>
          <button className="w-full py-3 px-4 rounded-xl font-semibold bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] text-white hover:from-[#7e4507] hover:to-[#8a6e5d] hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Explore Collection
          </button>
        </Link>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-2 px-3 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Preview
          </button>
          <button className="flex-1 py-2 px-3 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            Share
          </button>
        </div>
      </div>

      {/* Hover Animation Line */}
      <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#8a6e5d] to-[#7e4507] transition-all duration-300 ${
        isHovered ? 'w-full' : 'w-0'
      }`}></div>
    </div>
  );
}