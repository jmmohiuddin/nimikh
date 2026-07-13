import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { JsonLd } from './(shared)/JsonLd';
import { ScrollProgress } from './(shared)/ScrollProgress';
import { ScrollReveal } from './(shared)/ScrollReveal';
import { SiteFooter } from './(shared)/SiteFooter';
import { SiteNav } from './(shared)/SiteNav';
import { graph, organization, professionalService, webSite } from '@/lib/schema';
import { site } from '@/lib/site';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.name,
  openGraph: {
    type: 'website',
    locale: site.locale,
    siteName: site.name,
    url: site.url,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export const viewport: Viewport = {
  themeColor: '#08090a',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        {/* Site-wide entity graph (NIM-011): one JSON-LD blob, stable @ids. */}
        <JsonLd data={graph(organization(), webSite(), professionalService())} />
        <ScrollProgress />
        <SiteNav />
        {children}
        <SiteFooter />
        <ScrollReveal />
      </body>
    </html>
  );
}
