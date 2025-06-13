'use client';

import { useEffect, useState } from 'react';

export default function AdminCategoryGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/category-groups');
      const data = await res.json();
      if (res.ok) {
        setGroups(data.groups);
      } else {
        setError(data.error || 'Failed to fetch groups');
      }
    } catch (e) {
      setError('Failed to fetch groups');
    }
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this group?')) return;
    const res = await fetch('/api/admin/category-groups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    if (res.ok) {
      setGroups(groups.filter(g => g.id !== id));
    } else {
      alert('Failed to delete group');
    }
  }

  function handleEdit(group) {
    setForm({ name: group.name });
    setEditingId(group.id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editingId ? 'PATCH' : 'POST';
    const body = editingId ? { id: editingId, ...form } : form;
    const res = await fetch('/api/admin/category-groups', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      const data = await res.json();
      if (editingId) {
        setGroups(groups.map(g => g.id === editingId ? data.group : g));
        setEditingId(null);
      } else {
        setGroups([...groups, data.group]);
      }
      setForm({ name: '' });
    } else {
      alert('Failed to save group');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Category Groups</h1>
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
          {groups.map(group => (
            <tr key={group.id} className="border-b">
              <td className="p-2 border">{group.name}</td>
              <td className="p-2 border space-x-2">
                <button onClick={() => handleEdit(group)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(group.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
