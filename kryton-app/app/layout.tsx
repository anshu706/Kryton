import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#05070D',
};

export const metadata: Metadata = {
  title: 'Kryton — Research, illuminated.',
  description:
    'AI-powered deep research platform. Ask anything. Get structured reports, interactive insights, and visual explainers — instantly.',
  keywords: ['AI research', 'deep research', 'academic search', 'Kryton'],
  authors: [{ name: 'Kryton' }],
  openGraph: {
    title: 'Kryton — Research, illuminated.',
    description: 'AI-powered deep research platform.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kryton — Research, illuminated.',
    description: 'AI-powered deep research platform.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var reg of registrations) {
                    reg.unregister();
                  }
                });
                if ('caches' in window) {
                  caches.keys().then(function(names) {
                    for (var name of names) {
                      caches.delete(name);
                    }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body
        style={{
          backgroundColor: '#05070D',
          fontFamily: "var(--font-body), system-ui, sans-serif",
          minHeight: '100vh',
          color: '#FFFFFF',
        }}
      >
        {children}
      </body>
    </html>
  );
}

