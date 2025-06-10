"use client";

import { useRouter } from 'next/navigation';
import { Category } from '@/types';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

interface CategoryCardProps {
  product: Category;
}

export default function CategoryCard({ product }: { product: { id: string; name: string; image: string; description: string } }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer">
      <div className="relative h-80">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <p className="text-white/90 mb-4">{product.description}</p>
          <button className="self-start px-6 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300 flex items-center gap-2">
            Explore
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}