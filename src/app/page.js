import HeroSection from "@/components/HeroSection";
import FeaturedSection from "@/components/FeaturedSection";
import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedSection />
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Us
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Experience excellence in event organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-rose-100 rounded-full">
                <span className="material-icons-outlined text-3xl text-rose-600">
                  stars
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Professional Service</h3>
              <p className="text-gray-600">
                Expert team dedicated to making your event perfect
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-rose-100 rounded-full">
                <span className="material-icons-outlined text-3xl text-rose-600">
                  schedule
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">On-Time Delivery</h3>
              <p className="text-gray-600">
                We value your time and ensure punctual execution
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-rose-100 rounded-full">
                <span className="material-icons-outlined text-3xl text-rose-600">
                  favorite
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Your happiness is our top priority
              </p>
            </div>
          </div>
        </div>
      </section>

      <ContactForm />
    </main>
  );
}
