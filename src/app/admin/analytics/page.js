'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AnalyticsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/analytics');
        if (!res.ok) throw new Error('Failed to load analytics');
        const json = await res.json();
        setData(json.topProducts || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
        <p className="font-medium">Error loading analytics</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Top Products by Revenue</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Bar dataKey="revenue" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
