import { Metadata } from 'next'

type MetadataProps = {
  params: {
    title?: string
    description?: string
    type?: 'website' | 'article'
    slug?: string
    tags?: string[]
  }
}

export function generateMetadata({ params }: MetadataProps): Metadata {
  const title = params.title || 'Bhavesh Patil'
  const description = params.description || 'Frontend Developer focused on building innovative and modern web applications.'
  const type = params.type || 'website'
  const slug = params.slug || ''
  const tags = params.tags?.join(', ') || 'web development, Bhavesh Patil, portfolio'

  const baseUrl = 'https://iambhvsh.vercel.app'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | Bhavesh Patil`,
    },
    description,
    keywords: tags,
    authors: [{ name: 'Bhavesh Patil' }],
    viewport: 'width=device-width, initial-scale=1.0',
    themeColor: '#000000',
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${slug}`,
      siteName: 'Bhavesh Patil',
      locale: 'en_US',
      type,
      images: [
        {
          url: `https://placehold.co/1200x630/FFFFFF/000000/png?text=${encodeURIComponent(title.charAt(0))}&font=montserrat`,
          alt: `Placeholder image for ${title}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [
        `https://placehold.co/1200x630/FFFFFF/000000/png?text=${encodeURIComponent(title.charAt(0))}&font=montserrat`,
      ],
    },
    robots: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
  }
}
