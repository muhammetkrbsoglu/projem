'use client';

import { useEffect, useState } from 'react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages);
      } else {
        setError(data.error || 'Failed to fetch messages');
      }
    } catch (e) {
      setError('Failed to fetch messages');
    }
    setLoading(false);
  }

  async function sendReply(id) {
    const res = await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, reply: reply[id] })
    });
    if (res.ok) {
      setReply({ ...reply, [id]: '' });
      fetchMessages();
    } else {
      alert('Failed to send reply');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="border p-4 rounded bg-white space-y-2">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{m.subject}</p>
                <p className="text-sm text-gray-500">From: {m.user.name} ({m.user.email})</p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-gray-100">{m.status}</span>
            </div>
            <p className="whitespace-pre-wrap">{m.content}</p>
            <textarea
              className="w-full border p-2 text-sm"
              rows={3}
              placeholder="Type reply..."
              value={reply[m.id] || ''}
              onChange={e => setReply({ ...reply, [m.id]: e.target.value })}
            />
            <button
              onClick={() => sendReply(m.id)}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Send Reply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
