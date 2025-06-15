import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Removed the Google font import to avoid build failures when the font
// cannot be fetched from external sources. The application will now use
// the default sans-serif stack provided by Tailwind CSS.

export const metadata = {
  title: 'Meri App',
  description: 'Your app description',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary: 'bg-rose-500 hover:bg-rose-600',
          footerActionLink: 'text-rose-500 hover:text-rose-600'
        }
      }}
    >
      <html lang="en">
        <body className="font-sans">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
