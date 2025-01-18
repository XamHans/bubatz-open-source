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
  }
}

export default function BlogPostPage({ params }) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  // Ensure the image path is absolute and exists
  const imageUrl = post.image?.startsWith('/') ? post.image : `/${post.image}`
  console.log('Image URL:', imageUrl) // Debug log

  return (
    <div className={`my-4 min-h-screen ${inter.className}`}>
      <article className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <DocsPageHeader heading={post.title} text={post.description} />

          {post.image && (
            <div className="relative mb-6 w-full overflow-hidden rounded-lg">
              <div className="relative h-64 w-full sm:h-72 md:h-96">
                <Image
                  src={imageUrl}
                  alt={post.title || 'Blog post image'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            </div>
          )}

          <div className="prose prose-gray lg:prose-lg prose-img:rounded-lg prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 max-w-none">
            <Mdx code={post.body} />
          </div>
        </div>
      </article>
    </div>
  )
}
