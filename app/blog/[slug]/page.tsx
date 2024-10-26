import { Mdx } from '@/app/components/mdx-components'
import { DocsPageHeader } from '@/app/components/page-header'
import '@/styles/mdx.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
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

export default async function BlogPostPage({ params }: BlogPostProps) {
  const post = getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      <div className={`min-h-screen ${inter.className}`}>
        <main className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <article className="mx-auto max-w-3xl">
            <DocsPageHeader heading={post.title} text={post.description} />
            <div className="prose prose-gray prose-lg mt-8 max-w-none">
              <Mdx code={post.body} />
            </div>
          </article>
        </main>
      </div>
    </>
  )
}
