import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

async function checkAdminAccess() {
  const { userId } = auth();
  if (!userId) {
    redirect('/login');
  }
  
  const dbUser = await prisma.user.findUnique({ 
    where: { clerkId: userId },
    select: { role: true, name: true }
  });
  
  if (!dbUser || dbUser.role !== 'admin') {
    redirect('/');
  }
  
  return dbUser;
}

export default async function AdminLayout({ children }) {
  const admin = await checkAdminAccess();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-16 flex items-center px-6 bg-gray-800">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
        </div>
        <div className="p-6">
          <nav className="space-y-1">
            <Link 
              href="/admin" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link 
              href="/admin/users" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Users
            </Link>
            <Link 
              href="/admin/products" 
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Orders
            </Link>
            <Link
              href="/admin/categories"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Categories
            </Link>
            <Link
              href="/admin/category-groups"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Category Groups
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg group"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Messages
            </Link>
          </nav>
        </div>
      </aside><main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
