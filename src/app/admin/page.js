'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminManagementPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [messages, setMessages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        const [uRes, pRes, cRes, mRes] = await Promise.all([
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/products', { credentials: 'include' }),
          fetch('/api/categories', { credentials: 'include' }),
          fetch('/api/admin/messages', { credentials: 'include' }),
        ]);

        if (
          uRes.status === 401 ||
          pRes.status === 401 ||
          cRes.status === 401 ||
          mRes.status === 401
        ) {
          router.push('/login');
          return;
        }

        if (
          uRes.status === 403 ||
          pRes.status === 403 ||
          cRes.status === 403 ||
          mRes.status === 403
        ) {
          router.push('/');
          return;
        }

        const uData = await uRes.json();
        const pData = await pRes.json();
        const cData = await cRes.json();
        const mData = await mRes.json();
        setUsers(uData);
        setProducts(pData.data || []);
        setCategories(cData || []);
        setMessages(mData);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Admin Management</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="border px-2 py-1">{user.name}</td>
                <td className="border px-2 py-1">{user.email}</td>
                <td className="border px-2 py-1">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <ul className="space-y-1">
          {products.map((product) => (
            <li key={product.id} className="border px-2 py-1 rounded">
              {product.name} - ${'{'}product.price{'}'}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Categories</h2>
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li key={cat.id} className="border px-2 py-1 rounded">
              {cat.name}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Messages</h2>
        <ul className="space-y-1">
          {messages.map((msg) => (
            <li key={msg.id} className="border px-2 py-1 rounded">
              <div className="font-semibold">{msg.subject || 'No Subject'}</div>
              <div className="text-sm text-gray-600">
                From: {msg.user.name} ({msg.user.email})
              </div>
              <p className="text-gray-700">{msg.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
