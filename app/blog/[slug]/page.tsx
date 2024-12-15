import { getPostBySlug } from '../../../lib/blog'
import MDXContent from '../../components/MDXContent'
import Image from 'next/image'
import { AUTHOR, formatDate } from '../../../lib/shared'
import VerifiedBadge from '../../components/VerifiedBadge'
import { Metadata } from 'next'
import { getAllPosts } from '../../../lib/blog'
import { CopyLinkButton } from '../../components/CopyLinkButton'
import { notFound } from 'next/navigation'

// Using Next.js built-in types
type PageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug)
  
  // Return 404 if post doesn't exist
  if (!post) {
    notFound()
  }
  
  // Generate a more descriptive meta description
  const description = post.excerpt 
    ? `${post.excerpt} | Read this article by Bhavesh Patil about ${post.tags?.join(', ') || 'web development'}.`
    : `Read ${post.title} - An article by Bhavesh Patil about ${post.tags?.join(', ') || 'web development'}.`

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      url: `https://iambhvsh.vercel.app/blog/${params.slug}`,
      siteName: 'Bhavesh Patil',
      locale: 'en_US',
      type: 'article',
      images: [{
        url: `/api/og?title=${encodeURIComponent(post.title)}&type=article`,
        width: 1200,
        height: 630,
        alt: post.title
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [`/api/og?title=${encodeURIComponent(post.title)}&type=article`],
    }
  }
}

export default async function Page({ params }: PageProps) {
  const post = await getPostBySlug(params.slug)

  // Return 404 if post doesn't exist
  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-12">
      {post.coverImage && (
        <div className="aspect-video w-full relative rounded-xl overflow-hidden mb-12">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
            priority
          />
        </div>
      )}

      <article>
        <h1 className="text-3xl text-white font-bold mb-4">{post.title}</h1>
        
        <p className="text-gray-400 text-lg mb-8">{post.excerpt}</p>

        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={AUTHOR.image}
                alt={AUTHOR.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <VerifiedBadge className="absolute -right-1 -bottom-1 w-6 h-6" />
            </div>
            <div>
              <div className="font-medium text-white">{AUTHOR.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <span>{formatDate(post.date)}</span>
                <span>·</span>
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>
          
          <CopyLinkButton slug={params.slug} />
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="border-t border-zinc-800">
          <div className="prose prose-invert max-w-none">
            <MDXContent source={post.content} />
          </div>
        </div>
      </article>
    </div>
  )
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
