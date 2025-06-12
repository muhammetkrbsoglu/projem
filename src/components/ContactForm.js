'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function ContactForm({ productId, initialSubject }) {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: initialSubject || '',
    message: '',
  });
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSignedIn) {
      router.push('/login');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          productId,
        }),
      });

      if (res.status === 401) {
        router.push('/login');
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to send message');
      }
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Get in Touch
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Have questions? We&apos;d love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>
              <p className="text-gray-600 mb-8">
                Fill out the form and we&apos;ll get back to you as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <span className="material-icons-outlined text-2xl text-rose-500">
                  location_on
                </span>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Location</h4>
                  <p className="text-gray-600">123 Organization Street, City</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="material-icons-outlined text-2xl text-rose-500">
                  phone
                </span>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Phone</h4>
                  <p className="text-gray-600">+1 234 567 8900</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <span className="material-icons-outlined text-2xl text-rose-500">
                  email
                </span>
                <div>
                  <h4 className="text-lg font-medium text-gray-900">Email</h4>
                  <p className="text-gray-600">contact@yourcompany.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-rose-500 text-white py-3 px-6 rounded-md hover:bg-rose-600 transition-colors disabled:opacity-50 text-lg font-medium"
              >
                {status === 'loading' ? 'Sending...' : 
                 status === 'success' ? 'Message Sent!' : 
                 status === 'error' ? 'Failed to Send' : 
                 'Send Message'}
              </button>

              {status === 'error' && (
                <p className="text-red-600 text-sm text-center">Failed to send message. Please try again.</p>
              )}
              {status === 'success' && (
                <p className="text-green-600 text-sm text-center">Message sent successfully!</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
