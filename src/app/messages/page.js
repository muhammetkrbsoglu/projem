'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/login');
            return;
          }
          throw new Error('Failed to fetch messages');
        }
        const data = await res.json();
        setMessages(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      
      <div className="space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-600">No messages found.</p>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{message.subject || 'No Subject'}</h3>
                  <p className="text-sm text-gray-600">
                    From: {message.user.name} ({message.user.email})
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  message.status === 'read' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {message.status}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(message.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}