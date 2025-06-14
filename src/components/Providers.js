'use client';

import { ClerkProvider } from '@clerk/nextjs';

export function Providers({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-black hover:bg-gray-700 text-sm normal-case',
        },
      }}
      signInUrl="/login"
      signUpUrl="/register"
      fallbackRedirectUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
