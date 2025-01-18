import { Mdx } from '@/app/components/mdx-components'
import { DocsPageHeader } from '@/app/components/page-header'
import '@/styles/mdx.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import posts from '../../../.velite/posts.json'

const inter = Inter({ subsets: ['latin'] })

function getPostBySlug(slug: string): any {
  return posts.find((post) => post.slug === `blog/${slug}`)
}

interface BlogPostProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: BlogPostProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: post.image
      ? {
          images: [
            {
              url: post.image,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ],
        }
      : null,
  }
}

export default async function BlogPostPage({ params }: BlogPostProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <div className={`min-h-screen ${inter.className}`}>
        <article className="mx-auto max-w-3xl">
          <DocsPageHeader heading={post.title} text={post.description} />
          {post.image && (
            <div className="relative mb-8 h-[400px] w-full overflow-hidden rounded-lg">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="prose prose-gray prose-lg mt-8 max-w-none">
            <Mdx code={post.body} />
          </div>
        </article>
      </div>
    </>
  )
}
