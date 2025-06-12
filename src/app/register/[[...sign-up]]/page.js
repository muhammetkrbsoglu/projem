'use client';

import { SignUp } from '@clerk/nextjs';

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: 'bg-rose-500 hover:bg-rose-600',
            footerActionLink: 'text-rose-500 hover:text-rose-600',
          },
        }}
        routing="path"
        path="/register"
        signInUrl="/login"
        afterSignUpUrl="/"
      />
    </div>
  );
}
