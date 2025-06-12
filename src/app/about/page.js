export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent mb-8">
          About Our Gift Shop
        </h1>
        
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-rose-100 space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome to Our Store</h2>
            <p className="text-gray-600 leading-relaxed">
              We are your premier destination for unique and thoughtful gifts for all of life&apos;s special moments. 
              Specializing in wedding, henna night, and birthday celebrations, we carefully curate our collection 
              to help you find the perfect gift for every occasion.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Our Promise</h2>
            <p className="text-gray-600 leading-relaxed">
              Every gift in our collection is chosen with care and attention to detail. We believe that 
              the perfect gift has the power to make special moments even more memorable, and we&apos;re here 
              to help you create those lasting memories.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">What We Offer</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-rose-600">Wedding Gifts</h3>
                <p className="text-gray-600">Beautiful and meaningful gifts to celebrate the union of two hearts.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-rose-600">Henna Night Specials</h3>
                <p className="text-gray-600">Traditional and modern gifts to make the henna night unforgettable.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium text-rose-600">Birthday Surprises</h3>
                <p className="text-gray-600">Unique gifts that make birthdays extra special and memorable.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Visit Us</h2>
            <p className="text-gray-600 leading-relaxed">
              We&apos;d love to help you find the perfect gift in person. Visit our store or contact us 
              through WhatsApp for personalized assistance and recommendations.
            </p>
            <div className="flex justify-center mt-6">
              <a
                href="https://wa.me/your-number"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full hover:from-rose-600 hover:to-rose-700 transition-all shadow-sm"
              >
                Contact Us on WhatsApp
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
