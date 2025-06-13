'use client';

import React, { useEffect, useState } from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '', photoUrl: '', categoryId: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/categories'),
        ]);
        const productsData = await prodRes.json();
        const categoriesData = await catRes.json();
        if (prodRes.ok) {
          setProducts(productsData.products);
        } else {
          setError(productsData.error || 'Failed to fetch products');
        }
        if (catRes.ok) {
          setCategories(categoriesData.categories);
        }
      } catch (e) {
        setError('Failed to fetch products');
      }
      setLoading(false);
    }
    fetchData();
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
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      photoUrl: product.photoUrl || '',
      categoryId: product.categories?.[0]?.id || '',
    });
    setEditingId(product.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      // Edit
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        })
      });
      if (res.ok) {
        setProducts(products.map(p => p.id === editingId ? { ...p, ...form } : p));
        setEditingId(null);
        setForm({ name: '', price: '', stock: '', photoUrl: '', categoryId: '' });
      } else {
        alert('Failed to update product');
      }
    } else {
      // Add
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        })
      });
      if (res.ok) {
        const data = await res.json();
        setProducts([...products, data.product]);
        setForm({ name: '', price: '', stock: '', photoUrl: '', categoryId: '' });
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
          type="text"
          placeholder="Photo URL"
          value={form.photoUrl}
          onChange={e => setForm({ ...form, photoUrl: e.target.value })}
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
        <select
          value={form.categoryId}
          onChange={e => setForm({ ...form, categoryId: e.target.value })}
          className="border px-2 py-1"
          required
        >
          <option value="" disabled>Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', price: '', stock: '', photoUrl: '', categoryId: '' }); }} className="ml-2 px-2 py-1 border rounded">Cancel</button>
        )}
      </form>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Photo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Price</th>
            <th className="p-2 border">Stock</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id} className="border-b">
              <td className="p-2 border">
                {product.photoUrl && (
                  <img src={product.photoUrl} alt={product.name} className="w-16 h-16 object-cover" />
                )}
              </td>
              <td className="p-2 border">{product.name}</td>
              <td className="p-2 border">{product.price}</td>
              <td className="p-2 border">{product.stock}</td>
              <td className="p-2 border">{product.categories?.[0]?.name}</td>
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
