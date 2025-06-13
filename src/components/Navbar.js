'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const isAdmin = isSignedIn && user?.publicMetadata?.role === 'admin';

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <a href="tel:+1234567890" className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
              </svg>
              (123) 456-7890
            </a>
            <a href="mailto:info@example.com" className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              info@example.com
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link href="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            ) : (              <>
                <Link href="/profile" className="hover:text-gray-300">
                  Profile
                </Link>
                {isAdmin && (
                  <Link href="/admin" className="text-red-400 hover:text-red-300">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="hover:text-gray-300 cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="text-2xl font-bold">
              LOGO
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-black transition-colors"
              >
                About
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Services
              </Link>              <Link
                href="/contact"
                className="text-gray-700 hover:text-black transition-colors"
              >
                Contact
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <Link
                href="/"
                className="block py-2 text-gray-700 hover:text-black"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block py-2 text-gray-700 hover:text-black"
              >
                About
              </Link>
              <Link
                href="/products"
                className="block py-2 text-gray-700 hover:text-black"
              >
                Services
              </Link>
              <Link
                href="/contact"
                className="block py-2 text-gray-700 hover:text-black"
              >
                Contact              </Link>
              {!isSignedIn ? (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 hover:text-black"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 text-gray-700 hover:text-black"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    className="block py-2 text-gray-700 hover:text-black"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block py-2 text-gray-700 hover:text-black"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left py-2 text-gray-700 hover:text-black"
                  >
                    Logout
                  </button>
                </>
              )}
              {/* Contact Us Button (Mobile) */}
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-2 text-green-600 font-semibold hover:text-green-800 transition-colors"
              >
                Contact Us
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
