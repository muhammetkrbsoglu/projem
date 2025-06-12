'use client';

import React, { useEffect, useState } from 'react';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/orders');
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Failed to fetch orders');
        }
      } catch (e) {
        setError('Failed to fetch orders');
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this order?')) return;
    const res = await fetch('/api/admin/orders', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setOrders(orders.filter(o => o.id !== id));
    } else {
      alert('Failed to delete order');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">User</th>
            <th className="p-2 border">Products</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id} className="border-b">
              <td className="p-2 border">{order.id}</td>
              <td className="p-2 border">{order.user?.email || 'N/A'}</td>
              <td className="p-2 border">{order.products?.map(p => p.name).join(', ')}</td>
              <td className="p-2 border">
                <button onClick={() => handleDelete(order.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
