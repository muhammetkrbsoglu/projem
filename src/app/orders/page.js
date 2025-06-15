"use client";

import React, { useState, useEffect } from 'react';

export default function UserOrderPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ productId: '', categoryId: '', note: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const prodRes = await fetch('/api/products');
        const catRes = await fetch('/api/categories');
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        setProducts(prodData.data || []);
        setCategories(catData || []);
      } catch {
        // ignore fetch errors for now
      }
    }
    fetchData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          products: [form.productId],
          note: form.note
        })
      });
      if (res.ok) {
        setSuccess(true);
        setForm({ productId: '', categoryId: '', note: '' });
      } else {
        setError('Failed to create order');
      }
    } catch {
      setError('Failed to create order');
    }
    setLoading(false);
  }

  function handleContact() {
    window.open('https://wa.me/1234567890', '_blank'); // Replace with your WhatsApp number
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value, productId: '' })}
          className="border px-2 py-1 w-full"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={form.productId}
          onChange={e => setForm({ ...form, productId: e.target.value })}
          className="border px-2 py-1 w-full"
          required
        >
          <option value="">Select Product</option>
          {products.filter(p => !form.categoryId || p.categories.some(c => c.id === form.categoryId)).map(product => (
            <option key={product.id} value={product.id}>{product.name}</option>
          ))}
        </select>
        <textarea
          placeholder="Order note (optional)"
          value={form.note}
          onChange={e => setForm({ ...form, note: e.target.value })}
          className="border px-2 py-1 w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded" disabled={loading}>
          {loading ? 'Submitting...' : 'Create Order'}
        </button>
      </form>
      <button onClick={handleContact} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Contact Us on WhatsApp
      </button>
      {success && <div className="text-green-600">Order created successfully!</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
}
