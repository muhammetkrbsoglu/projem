'use client';

import React, { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/admin/categories');
        const data = await res.json();
        if (res.ok) {
          setCategories(data.categories);
        } else {
          setError(data.error || 'Failed to fetch categories');
        }
      } catch (e) {
        setError('Failed to fetch categories');
      }
      setLoading(false);
    }
    fetchCategories();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) return;
    const res = await fetch('/api/admin/categories', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setCategories(categories.filter(c => c.id !== id));
    } else {
      alert('Failed to delete category');
    }
  }

  async function handleEdit(category) {
    setForm({ name: category.name });
    setEditingId(category.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      // Edit
      const res = await fetch('/api/admin/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingId, ...form })
      });
      if (res.ok) {
        setCategories(categories.map(c => c.id === editingId ? { ...c, ...form } : c));
        setEditingId(null);
        setForm({ name: '' });
      } else {
        alert('Failed to update category');
      }
    } else {
      // Add
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        const data = await res.json();
        setCategories([...categories, data.category]);
        setForm({ name: '' });
      } else {
        alert('Failed to add category');
      }
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <form onSubmit={handleSubmit} className="mb-4 space-x-2">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border px-2 py-1"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ name: '' }); }} className="ml-2 px-2 py-1 border rounded">Cancel</button>
        )}
      </form>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(category => (
            <tr key={category.id} className="border-b">
              <td className="p-2 border">{category.name}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(category)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(category.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
