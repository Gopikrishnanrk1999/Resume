import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getPortfolio } from '@/lib/contentful';
import { THEME_INIT_SCRIPT } from '@/components/ThemeToggle';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const SITE_URL = 'https://gopikrishnan.info';

// Renders on every request instead of being statically built, so Contentful
// edits show up on a plain refresh with no redeploy or webhook needed.
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const settings = await getPortfolio();
  const ogImage = settings.ogImageUrl?.startsWith('http')
    ? settings.ogImageUrl
    : `${SITE_URL}${settings.ogImageUrl}`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: settings.siteTitle,
      template: `%s | ${settings.name}`,
    },
    description: settings.metaDescription,
    keywords: ['Gopikrishnan', 'Software Engineer', 'Frontend Developer', 'React', 'Next.js', 'Portfolio'],
    authors: [{ name: settings.name, url: SITE_URL }],
    creator: settings.name,
    openGraph: {
      type: 'website',
      url: SITE_URL,
      title: settings.siteTitle,
      description: settings.metaDescription,
      siteName: settings.siteTitle,
      images: [{ url: ogImage, width: 1200, height: 630, alt: settings.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.siteTitle,
      description: settings.metaDescription,
      images: [ogImage],
    },
    icons: {
      icon: '/DeveloperIcon.svg',
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getPortfolio();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings.name,
    jobTitle: settings.role,
    url: SITE_URL,
    email: settings.email,
    sameAs: [settings.linkedinUrl].filter(Boolean),
  };

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
