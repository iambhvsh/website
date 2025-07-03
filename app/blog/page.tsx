import Link from 'next/link'
import Image from 'next/image'
import { getAllPosts } from '../../lib/blog'
import { formatDate } from '../../lib/shared'
import { AUTHOR } from '../../lib/shared'
import VerifiedBadge from '../components/VerifiedBadge'
import { Metadata } from 'next'
import Script from 'next/script'

const SITE_URL = 'https://iambhvsh.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Blog',
  description: 'Thoughts and insights about web development by Bhavesh Patil. Read articles about web development, programming techniques, and technology.',
  keywords: ['web development', 'frontend development', 'programming', 'tech blog', 'Bhavesh Patil'],
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  creator: AUTHOR.name,
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: 'Blog | Bhavesh Patil',
    description: 'Thoughts and insights about web development by Bhavesh Patil',
    url: `${SITE_URL}/blog`,
    siteName: 'Bhavesh Patil',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: AUTHOR.image,
        width: 1200,
        height: 630,
        alt: 'Bhavesh Patil Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Bhavesh Patil',
    description: 'Thoughts and insights about web development by Bhavesh Patil',
    creator: '@iambhvsh',
    site: '@iambhvsh',
    images: [AUTHOR.image],
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
}

export default async function Blog() {
  const posts = await getAllPosts()

  return (
    <>
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            url: `${SITE_URL}/blog`,
            name: 'Bhavesh Patil Blog',
            description: 'Thoughts and insights about web development.',
            author: {
              '@type': 'Person',
              name: AUTHOR.name,
              url: SITE_URL,
              image: AUTHOR.image,
            },
            blogPost: posts.map((post) => ({
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                '@type': 'Person',
                name: AUTHOR.name,
                url: SITE_URL,
                image: AUTHOR.image,
              },
              url: `${SITE_URL}/blog/${post.slug}`,
              keywords: post.tags.join(', '),
            })),
          }),
        }}
      />

      <div className="max-w-3xl mx-auto sm-px-16 px-4 pt-32 py-12">
        <header className="mb-16">
          <h1 className="text-4xl text-white font-bold mb-3">Blog</h1>
          <p className="text-gray-400 text-lg">
            Thoughts and insights about web development.
          </p>
        </header>

        <div className="divide-y divide-zinc-800">
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="group py-8 first:pt-0 last:pb-0"
              itemScope 
              itemType="https://schema.org/BlogPosting"
            >
              <Link href={`/blog/${post.slug}`}>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={AUTHOR.image}
                        alt={AUTHOR.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        itemProp="image"
                      />
                      <VerifiedBadge className="absolute -right-0.5 -bottom-0.5 w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span className="font-medium text-white" itemProp="author" itemScope itemType="https://schema.org/Person">
                        <span itemProp="name">{AUTHOR.name}</span>
                      </span>
                      <span>·</span>
                      <time dateTime={post.date} itemProp="datePublished">
                        {formatDate(post.date)}
                      </time>
                      <span>·</span>
                      <span itemProp="timeRequired">{post.readingTime}</span>
                    </div>
                  </div>

                  <div>
                    <h2 
                      className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3"
                      itemProp="headline"
                    >
                      {post.title}
                    </h2>
                    <p className="text-gray-400 line-clamp-2" itemProp="description">
                      {post.excerpt}
                    </p>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span 
                          key={tag} 
                          className="text-sm text-gray-500"
                          itemProp="keywords"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <meta itemProp="url" content={`${SITE_URL}/blog/${post.slug}`} />
                  <meta itemProp="mainEntityOfPage" content={`${SITE_URL}/blog/${post.slug}`} />
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
