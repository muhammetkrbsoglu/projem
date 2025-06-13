import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from '../../components/AdminLayout';

export default function Products() {
  const [products, setProducts] = useState([]);
  const nameRef = useRef();
  const priceRef = useRef();
  const fileRef = useRef();

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const handleAdd = async e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', nameRef.current.value);
    form.append('price', priceRef.current.value);
    form.append('image', fileRef.current.files[0]);

    await fetch('/api/admin/products', { method: 'POST', body: form });
    // refresh list
    const updated = await fetch('/api/admin/products').then(r => r.json());
    setProducts(updated);
  };

  const handleDelete = async id => {
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <AdminLayout>
      <h1>Ürün Yönetimi</h1>
      <form onSubmit={handleAdd} style={{ marginBottom: '2rem' }}>
        <input ref={nameRef} placeholder="Ürün Adı" required />
        <input ref={priceRef} placeholder="Fiyat" required type="number" />
        <input ref={fileRef} type="file" accept="image/*" required />
        <button type="submit">Ekle</button>
      </form>

      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - {p.price}₺
            <button onClick={() => handleDelete(p.id)}>Sil</button>
            {/* Güncelleme işlevi benzer şekilde eklenebilir */}
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
