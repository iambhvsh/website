import { getPostBySlug, getAllPosts } from '../../../lib/blog';
import MDXContent from '../../components/MDXContent';
import Image from 'next/image';
import { AUTHOR, formatDate } from '../../../lib/shared';
import VerifiedBadge from '../../components/VerifiedBadge';
import { Metadata } from 'next';
import { CopyLinkButton } from '../../components/CopyLinkButton';
import { notFound } from 'next/navigation';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import Script from 'next/script';

interface Post {
  title: string;
  excerpt: string;
  tags?: string[];
  slug: string;
  coverImage?: string;
  date: string;
  readingTime: string;
  content: MDXRemoteSerializeResult;
}

type PageProps = {
  params: {
    slug: string;
  };
};

const SITE_URL = 'https://iambhvsh.vercel.app';

async function fetchPostOr404(slug: string): Promise<Post> {
  const post = await getPostBySlug(slug) as Post;
  if (!post) notFound();
  return post;
}

function constructMetadata(post: Post): Metadata {
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const publishDate = new Date(post.date).toISOString();
  
  const description = post.excerpt
    ? `${post.excerpt} | Read this article by Bhavesh Patil about ${post.tags?.join(', ') || 'web development'}.`
    : `Read ${post.title} - An article by Bhavesh Patil about ${post.tags?.join(', ') || 'web development'}.`;

  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: `${post.title} | Bhavesh Patil`,
    description,
    authors: [{ name: AUTHOR.name, url: SITE_URL }],
    keywords: post.tags,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      siteName: 'Bhavesh Patil',
      locale: 'en_US',
      type: 'article',
      publishedTime: publishDate,
      modifiedTime: publishDate,
      authors: [AUTHOR.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      creator: '@iambhvsh',
      site: '@iambhvsh',
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
  };

  if (post.coverImage) {
    const imageMetadata = {
      url: post.coverImage,
      width: 1200,
      height: 630,
      alt: post.title,
      type: 'image/jpeg',
    };

    metadata.openGraph = {
      ...metadata.openGraph,
      images: [imageMetadata],
    };
    metadata.twitter = {
      ...metadata.twitter,
      images: [post.coverImage],
    };
  }

  return metadata;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await fetchPostOr404(params.slug);
  return constructMetadata(post);
}

export default async function Page({ params }: PageProps) {
  const post = await fetchPostOr404(params.slug);
  const canonicalUrl = `${SITE_URL}/blog/${params.slug}`;
  const publishDate = new Date(post.date).toISOString();

  return (
    <>
      <article className="max-w-3xl mx-auto px-4 pt-24 pb-12" itemScope itemType="https://schema.org/BlogPosting">
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.excerpt,
              image: post.coverImage,
              datePublished: publishDate,
              dateModified: publishDate,
              author: {
                '@type': 'Person',
                name: AUTHOR.name,
                url: SITE_URL,
                image: AUTHOR.image,
              },
              publisher: {
                '@type': 'Person',
                name: AUTHOR.name,
                url: SITE_URL,
                image: AUTHOR.image,
              },
              mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': canonicalUrl,
              },
              keywords: post.tags?.join(', '),
            }),
          }}
        />

        {post.coverImage && (
          <div className="aspect-video w-full relative rounded-xl overflow-hidden mb-12">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 75vw"
              priority
              itemProp="image"
            />
          </div>
        )}

        <header>
          <h1 className="text-3xl text-white font-bold mb-4" itemProp="headline">
            {post.title}
          </h1>
          <p className="text-gray-400 text-lg mb-8" itemProp="description">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative" itemProp="author" itemScope itemType="https://schema.org/Person">
                <Image
                  src={AUTHOR.image}
                  alt={AUTHOR.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                  itemProp="image"
                />
                <VerifiedBadge className="absolute -right-1 -bottom-1 w-6 h-6" />
                <meta itemProp="name" content={AUTHOR.name} />
                <link itemProp="url" href={SITE_URL} />
              </div>
              <div>
                <div className="font-medium text-white">{AUTHOR.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <time dateTime={post.date} itemProp="datePublished">
                    {formatDate(post.date)}
                  </time>
                  <span>·</span>
                  <span itemProp="timeRequired">{post.readingTime}</span>
                </div>
              </div>
            </div>
            <CopyLinkButton slug={params.slug} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-gray-400" itemProp="keywords">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="border-t border-zinc-800">
          <div 
            className="prose prose-invert max-w-none" 
            aria-label="Article content"
            itemProp="articleBody"
          >
            <MDXContent source={post.content} />
          </div>
        </div>

        <meta itemProp="url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </article>
    </>
  );
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
