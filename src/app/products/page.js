import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      categories: true
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      
      {products.length === 0 ? (
        <p className="text-gray-600">No products available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}