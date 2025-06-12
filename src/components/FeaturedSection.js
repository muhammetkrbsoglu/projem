import Image from 'next/image';

export default function FeaturedSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Our Featured Services
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover our premium organization services
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Wedding Events */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552"
                alt="Wedding Events"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Wedding Events</h3>
              <p className="mt-2 text-gray-600">
                Create your perfect wedding day with our expert planning and organization services.
              </p>
            </div>
          </div>

          {/* Corporate Events */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1511578314322-379afb476865"
                alt="Corporate Events"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Corporate Events</h3>
              <p className="mt-2 text-gray-600">
                Professional organization for your business meetings and corporate celebrations.
              </p>
            </div>
          </div>

          {/* Special Events */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-64">
              <Image
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7"
                alt="Special Events"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Special Events</h3>
              <p className="mt-2 text-gray-600">
                Turn your special occasions into unforgettable memories with our planning expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
