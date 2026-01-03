import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header, Footer, JourneyNav } from "@/components/Common";
import { SessionProviderWrapper } from "@/components/SessionProvider";
import { GoogleAnalytics } from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Mindful Daily Planner — Balance Productivity & Wellness',
    template: '%s | Mindful Planner',
  },
  description: 'Plan your day mindfully with 7 zones: deep work, quick wins, recharge, and reflection. Achieve more without burnout. Free during beta.',
  keywords: ['daily planner', 'productivity app', 'wellness planner', 'mindful productivity', 'work-life balance', 'deep work', 'daily reflection', 'habit tracker'],
  authors: [{ name: 'Mindful Planner Team' }],
  creator: 'Mindful Planner',
  publisher: 'Mindful Planner',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Mindful Daily Planner',
    title: 'Mindful Daily Planner — Balance Productivity & Wellness',
    description: 'Plan your day mindfully with 7 zones: deep work, quick wins, recharge, and reflection. Achieve more without burnout.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Mindful Daily Planner - Plan with Purpose, Not Pressure',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mindful Daily Planner — Balance Productivity & Wellness',
    description: 'Achieve more without burnout with our 7-zone daily planner.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add these when you set up Google Search Console
    // google: 'your-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Mindful Daily Planner',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <GoogleAnalytics />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <SessionProviderWrapper>
          {/* Skip to main content link for keyboard users */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-br-lg"
          >
            Skip to main content
          </a>

          <Header />
          <JourneyNav />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

