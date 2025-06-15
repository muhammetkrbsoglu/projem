'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-xl mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-24 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          href="/products"
          className="inline-block bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm">
            <Image
              src={product.photoUrl}
              alt={product.name}
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-rose-600">{`$${product.price.toFixed(2)}`}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-sm"
                >
                  {category.name}
                </span>
              ))}
            </div>

            {product.stock > 0 ? (
              <p className="text-green-600">In Stock: {product.stock} units</p>
            ) : (
              <p className="text-red-600">Out of Stock</p>
            )}

            <div className="space-x-4">              <Link
                href={`/contact?productId=${product.id}&subject=Inquiry about ${product.name}`}
                className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-colors"
              >
                Contact to Order
              </Link>
              <Link
                href="/products"
                className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
