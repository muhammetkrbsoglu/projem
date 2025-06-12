import Link from 'next/link';

export default function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: '200px', borderRight: '1px solid #ddd', padding: '1rem' }}>
        <h2>Admin Menu</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link href="/admin/products">Ürünler</Link></li>
          <li><Link href="/admin/categories">Kategoriler</Link></li>
          <li><Link href="/admin/users">Kullanıcılar</Link></li>
          <li><Link href="/admin/messages">Mesajlar</Link></li>
        </ul>
      </aside>
      <main style={{ flex: 1, padding: '1rem' }}>
        {children}
      </main>
    </div>
  );
}


// =============================================================
// File: pages/admin/index.js
// Admin dashboard landing
// =============================================================
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1>Admin Panel</h1>
      <p>Hoş geldiniz, yönetici!</p>
      <ul>
        <li><Link href="/admin/products">Ürün Yönetimi</Link></li>
        <li><Link href="/admin/categories">Kategori Yönetimi</Link></li>
        <li><Link href="/admin/users">Kullanıcılar</Link></li>
        <li><Link href="/admin/messages">Mesajlar</Link></li>
      </ul>
    </AdminLayout>
  );
}
// =============================================================
// File: pages/admin/products.js        