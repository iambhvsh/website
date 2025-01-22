import './globals.css'
import { Space_Grotesk } from 'next/font/google'
import Providers from './components/Providers'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { generateMetadata } from './metadata'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export { generateMetadata }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="application-name" content="Bhavesh Patil" />
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
        />

        {/* Social Scripts */}
        <script async src="https://platform.twitter.com/widgets.js" />
      </head>
      <body className={`${spaceGrotesk.className} min-h-screen bg-black`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
