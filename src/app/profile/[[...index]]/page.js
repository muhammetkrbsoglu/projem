'use client';

import { UserProfile } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <UserProfile
        appearance={{
          elements: {
            formButtonPrimary: 'bg-rose-500 hover:bg-rose-600',
            card: 'rounded-lg shadow-md',
          },
        }}
        routing="path"
        path="/profile"
        afterSignOutUrl="/"
      />
    </div>
  );
}
