import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import Script from 'next/script'
import Providers from './components/Providers'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { generateMetadata } from './metadata'
import { siteConfig } from './config/site'
import { Analytics } from "@vercel/analytics/react"

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
})

export { generateMetadata }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content={siteConfig.name} />
        <meta name="theme-color" content="#000000" />

        {/* Favicon and Icons */}
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          href="https://placehold.co/32x32/FFFFFF/000000/png?text=B&font=montserrat"
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="https://placehold.co/180x180/FFFFFF/000000/png?text=B&font=montserrat"
        />

        {/* Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
          as="style"
        />

        <meta name="google-site-verification" content="NZeVYWwxwJQXPJC-mu3ccZpG6L2O8hes7185XXl04wI" />
      </head>
      <body className={`${spaceGrotesk.className} min-h-screen bg-black`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children} <Analytics /></main>
          <Footer />
        </Providers>

        {/* Structured Data */}
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteConfig.url,
              description: siteConfig.description,
              author: {
                '@type': 'Person',
                name: siteConfig.author,
                url: siteConfig.url,
                sameAs: [
                  `https://github.com/${siteConfig.github}`,
                  `https://twitter.com/${siteConfig.twitter.replace('@', '')}`,
                ],
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
