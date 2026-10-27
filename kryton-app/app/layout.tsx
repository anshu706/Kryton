import type { Metadata } from 'next';
import './globals.css';

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
  viewport: { width: 'device-width', initialScale: 1 },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          backgroundColor: '#05070D',
          fontFamily: "'Inter', system-ui, sans-serif",
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
