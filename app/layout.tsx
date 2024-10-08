import { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Footer } from "@/components/footer";
import Head from "next/head";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bhavesh Patil",
  metadataBase: new URL("https://iambhvsh.vercel.app"),
  description:
    "Hello! I am a Frontend Web Developer. This is not just any documentation site—here, you'll find a wealth of important information and insights. 🌟",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <meta
          name="google-site-verification"
          content="UkG6otmqZFb_kB50fQvIFqrqZGYNm00YpfKG9B_aGTY"
        />
      </Head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-regular`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="sm:container mx-auto w-[85vw] h-auto">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
