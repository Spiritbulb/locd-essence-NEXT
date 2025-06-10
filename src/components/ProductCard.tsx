'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';

type Product = {
  id: string | number;
  name: string;
  image: string;
  slug: string;
  price: number | string;
  discount?: number;
  isNew?: boolean;
  rating: number;
  stock: number;
  description: string;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors">
          <Heart className="w-5 h-5 text-[#8a6e5d]" />
        </button>
      </div>
      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
        <button className="w-full py-2 px-4 bg-[#8a6e5d] text-white rounded-full font-medium hover:bg-[#7e4507] transition-colors flex items-center justify-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))}
        <span className="text-sm text-gray-600 ml-2">({product.rating})</span>
      </div>
      <h3 className="font-semibold text-lg mb-2 text-gray-900">{product.name}</h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-[#8a6e5d]">${product.price}</span>
        <span className="text-sm text-gray-500">{product.stock} left</span>
      </div>
    </div>
  </div>
)}
