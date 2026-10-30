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
  themeColor: '#1A0706',
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
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
      <head />
      <body
        style={{
          backgroundColor: '#1A0706',
          fontFamily: "var(--font-body), system-ui, sans-serif",
          minHeight: '100vh',
          color: '#D9D9D9',
        }}
      >
        {children}
      </body>
    </html>
  );
}

