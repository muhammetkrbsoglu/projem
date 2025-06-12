'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }) {  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-700 text-sm normal-case',
        },
      }}
      // Using new redirect props instead of deprecated ones
      signInUrl="/login"
      signUpUrl="/register"
      // Where to go after sign in/up
      fallbackRedirectUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
