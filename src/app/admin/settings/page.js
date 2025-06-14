'use client';
import React, { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({ siteName: '', siteDescription: '', contactEmail: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/settings');
        const data = await res.json();
        if (res.ok) {
          setForm({
            siteName: data.setting.siteName || '',
            siteDescription: data.setting.siteDescription || '',
            contactEmail: data.setting.contactEmail || '',
          });
        } else {
          setError(data.error || 'Failed to load settings');
        }
      } catch (e) {
        setError('Failed to load settings');
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    const res = await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const data = await res.json();
      setForm({
        siteName: data.setting.siteName || '',
        siteDescription: data.setting.siteDescription || '',
        contactEmail: data.setting.contactEmail || '',
      });
      setMessage('Settings updated');
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to update settings');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Site Settings</h1>
      {message && <div className="text-green-600 mb-2">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Site Name</label>
          <input
            type="text"
            value={form.siteName}
            onChange={e => setForm({ ...form, siteName: e.target.value })}
            className="border px-2 py-1 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Site Description</label>
          <textarea
            value={form.siteDescription}
            onChange={e => setForm({ ...form, siteDescription: e.target.value })}
            className="border px-2 py-1 w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Contact Email</label>
          <input
            type="email"
            value={form.contactEmail}
            onChange={e => setForm({ ...form, contactEmail: e.target.value })}
            className="border px-2 py-1 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
