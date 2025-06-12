'use client';

import React, { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/products');
        const data = await res.json();
        if (res.ok) {
          setProducts(data.products);
        } else {
          setError(data.error || 'Failed to fetch products');
        }
      } catch (e) {
        setError('Failed to fetch products');
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    const res = await fetch('/api/admin/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setProducts(products.filter(p => p.id !== id));
    } else {
      alert('Failed to delete product');
    }
  }

  async function handleEdit(product) {
    setForm({ name: product.name, price: product.price, stock: product.stock });
    setEditingId(product.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      // Edit
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form, price: Number(form.price), stock: Number(form.stock) })
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === editingId ? { ...p, ...form } : p));
        setEditingId(null);
        setForm({ name: '', price: '', stock: '' });
      } else {
        alert('Failed to update product');
      }
    } else {
      // Add
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), stock: Number(form.stock) })
      });
      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.product]);
        setForm({ name: '', price: '', stock: '' });
      } else {
        alert('Failed to add product');
      }
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <input
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={e => setForm({ ...form, stock: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', price: '', stock: '' }); }} className="ml-2 px-2 py-1 border rounded">Cancel</button>
        )}
      </form>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b">
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.price}</td>
              <td className="p-2 border">{product.stock}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(product)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
