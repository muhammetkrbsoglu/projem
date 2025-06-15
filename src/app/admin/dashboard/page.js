'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/admin/summary', { credentials: 'include' });
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          if (res.status === 403) {
            router.push('/');
            return;
          }
          throw new Error('Failed to fetch');
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Failed to load data.</p>
      </div>
    );
  }

  const cards = [
    { label: 'Users', value: stats.users },
    { label: 'Products', value: stats.products },
    { label: 'Orders', value: stats.orders },
    { label: 'Categories', value: stats.categories },
    { label: 'Messages', value: stats.messages },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white p-6 rounded shadow text-center"
          >
            <p className="text-4xl font-bold mb-2">{card.value}</p>
            <p className="text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
