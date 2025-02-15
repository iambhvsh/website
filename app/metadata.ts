import { Metadata } from 'next'
import { siteConfig } from './config/site'

type MetadataProps = {
  params: {
    title?: string
    description?: string
    type?: 'website' | 'article'
    slug?: string
    tags?: string[]
    publishedTime?: string
    modifiedTime?: string
    image?: string
  }
}

export function generateMetadata({ params }: MetadataProps): Metadata {
  const title = params.title || siteConfig.name
  const description = params.description || siteConfig.description
  const type = params.type || 'website'
  const slug = params.slug || ''
  const tags = params.tags?.join(', ') || 'web development, frontend developer, portfolio, nextjs'
  const image = params.image || `https://placehold.co/1200x630/FFFFFF/000000/png?text=${encodeURIComponent(title.charAt(0))}&font=montserrat`

  const url = `${siteConfig.url}${slug ? `/${slug}` : ''}`

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    keywords: tags,
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-video-preview': -1,
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: 'en_US',
      type,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime: params.publishedTime,
        modifiedTime: params.modifiedTime,
        authors: [siteConfig.url],
        tags: params.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: siteConfig.twitter,
      images: [image],
    },
  }
}
