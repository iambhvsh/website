import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import Providers from './components/Providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { generateMetadata } from './metadata'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

export { generateMetadata }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="https://placehold.co/32x32/000000/FFFFFF/png?text=B&font=montserrat" type="image/png" />
        <link rel="apple-touch-icon" href="https://placehold.co/180x180/000000/FFFFFF/png?text=B&font=montserrat" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
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
