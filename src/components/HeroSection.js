import Image from 'next/image';

export default function HeroSection() {
  return (
    <div className="relative bg-gray-900 h-[600px]">
      {/* Hero Background Image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3"
          alt="Hero Background - Elegant Event Setting"
          fill
          className="object-cover"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center h-full">
          <h1 className="text-4xl md:text-6xl font-bold text-white max-w-2xl">
            Creating Perfect Events & Memorable Moments
          </h1>
          <p className="mt-6 max-w-xl text-xl text-gray-300">
            Professional organization services for weddings, corporate events,
            and special occasions.
          </p>
          <div className="mt-10">
            <a
              href="/contact"
              className="inline-block bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-3 text-lg font-medium rounded-lg hover:from-rose-600 hover:to-rose-700 transition-all duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
