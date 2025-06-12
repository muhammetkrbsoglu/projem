'use client';

import ContactForm from '@/components/ContactForm';
import { FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import { use } from 'react';
import Link from 'next/link';

export default function ContactPage({ searchParams: searchParamsPromise }) {
  const searchParams = use(searchParamsPromise);
  const { productId, subject } = searchParams || {};
  
  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: 'https://wa.me/your-phone-number', // Replace with your WhatsApp number
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      url: 'https://facebook.com/your-page', // Replace with your Facebook page
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Instagram',
      icon: FaInstagram,
      url: 'https://instagram.com/your-profile', // Replace with your Instagram profile
      color: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
        {/* Social Media Links */}
        <div className="w-full lg:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold mb-4">Connect With Us</h2>
          <div className="space-y-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-white p-3 rounded-lg transition-all ${social.color}`}
                >
                  <Icon className="text-xl" />
                  <span>Contact via {social.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact Form */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
          <ContactForm productId={productId} initialSubject={subject} />
        </div>
      </div>
    </div>
  );
}