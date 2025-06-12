'use client';

import Link from 'next/link';
import Image from 'next/image';

function ProductCard({ product }) {
  if (!product) return null;
  return (
    <Link href={`/products/${product.id}`} className="block group">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-300 border border-rose-100">
        {product.photoUrl && (
          <div className="aspect-square relative bg-gray-50">
            <Image
              src={product.photoUrl}
              alt={product.name}
              width={300}
              height={300}
              className="object-cover w-full h-full"
            />
          </div>
        )}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
          <p className="text-rose-600 font-medium">{`$${product.price.toFixed(2)}`}</p>
          <div className="flex flex-wrap gap-1">
            {product.categories?.map((category) => (
              <span
                key={category.id}
                className="inline-block px-2 py-1 text-xs rounded-full bg-rose-100 text-rose-800"
              >
                {category.name}
              </span>
            ))}
          </div>
          {product.stock > 0 ? (
            <p className="text-sm text-green-600">In Stock: {product.stock}</p>
          ) : (
            <p className="text-sm text-red-600">Out of Stock</p>
          )}
          <div className="mt-2 block w-full text-center bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-lg group-hover:from-rose-600 group-hover:to-rose-700 transition-all duration-300">
            View Details
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
