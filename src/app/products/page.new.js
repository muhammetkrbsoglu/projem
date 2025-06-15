'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SimpleProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow">
              <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent mb-8">
        Our Products
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-rose-100">
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
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-rose-600 font-medium">${product.price.toFixed(2)}</p>
              <Link
                href={`/products/${product.id}`}
                className="block w-full text-center bg-gradient-to-r from-rose-500 to-rose-600 text-white py-2 rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-300"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimpleProductPage;
