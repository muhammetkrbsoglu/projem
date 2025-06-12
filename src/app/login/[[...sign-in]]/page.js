'use client';

import { SignIn } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/register"
          redirectUrl={redirectUrl}
          appearance={{
            elements: {
              formButtonPrimary: 'bg-rose-500 hover:bg-rose-600',
              footerActionLink: 'text-rose-500 hover:text-rose-600',
            },
          }}
        />
      </div>
    </div>
  );
}
