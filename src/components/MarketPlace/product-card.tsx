'use client'

import Image from 'next/image'
import { memo } from 'react'

export interface Product {
  id: string;
  name: string;
  image: string;
  category: 'sports' | 'nutrition';
  pointsRequired: number;
  minLevel: number;
  description: string;
  stock: number;
}

interface ProductCardProps {
  product: Product;
  onRedeem: (product: Product) => void;
}

const ProductCard = memo(({ product, onRedeem }: ProductCardProps) => {
  return (
    <div className="bg-yellow-400 border-t-2 border-l-2 border-r-4 border-b-4 border-black rounded-2xl overflow-hidden">
      <div className="relative h-48">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border-2 border-black ${
            product.category === 'sports'
              ? 'bg-blue-500 text-white'
              : 'bg-green-500 text-white'
          }`}>
            {product.category === 'sports' ? '🏃 Sports' : '🥗 Nutrition'}
          </span>
        </div>
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-black">{product.name}</h3>
          <p className="text-black/70 text-sm">{product.description}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="bg-white/40 px-3 py-2 rounded-xl border-2 border-black flex-1">
              <span className="text-xs font-semibold text-black/60">Points Required</span>
              <p className="font-bold text-black text-lg">⭐ {product.pointsRequired}</p>
            </div>
            <div className="bg-white/40 px-3 py-2 rounded-xl border-2 border-black flex-1">
              <span className="text-xs font-semibold text-black/60">Min Level</span>
              <p className="font-bold text-black text-lg">🏆 {product.minLevel}</p>
            </div>
          </div>

          <button
            onClick={() => onRedeem(product)}
            disabled={product.stock <= 0}
            className={`w-full px-6 py-2 font-bold rounded-xl border-t-2 border-l-2 border-r-4 border-b-4 border-black transition-all duration-200 ${
              product.stock <= 0
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-orange-500 text-white hover:bg-orange-600 active:transform active:translate-x-1 active:translate-y-1 active:border-r-2 active:border-b-2'
            }`}
          >
            Redeem
          </button>
        </div>

        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-red-600 font-semibold">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard
