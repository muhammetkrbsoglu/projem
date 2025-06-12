'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">About Us</h3>
            <p className="text-gray-400 text-sm">
              We specialize in providing high-quality organization and event services
              for all your special occasions.
            </p>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm flex items-center">
                <span className="material-icons-outlined mr-2 text-rose-500">location_on</span>
                123 Organization Street, City
              </p>
              <p className="text-gray-400 text-sm flex items-center">
                <span className="material-icons-outlined mr-2 text-rose-500">phone</span>
                +1 234 567 8900
              </p>
              <p className="text-gray-400 text-sm flex items-center">
                <span className="material-icons-outlined mr-2 text-rose-500">email</span>
                contact@yourcompany.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-white text-sm">About Us</a>
              </li>
              <li>
                <a href="/products" className="text-gray-400 hover:text-white text-sm">Products</a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Our Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Event Organization</li>
              <li className="text-gray-400 text-sm">Venue Decoration</li>
              <li className="text-gray-400 text-sm">Wedding Planning</li>
              <li className="text-gray-400 text-sm">Corporate Events</li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="material-icons-outlined">facebook</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="material-icons-outlined">instagram</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="material-icons-outlined">twitter</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Your Company Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
