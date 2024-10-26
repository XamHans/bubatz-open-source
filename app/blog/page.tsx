import { ArrowRight, CalendarIcon } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { posts } from '../../.velite'

type Post = {
  slug: string
  slugAsParams: string
  title: string
  description: string
  date: string
  tags: string[]
  coverImage?: string
}

const siteName = 'Bubatz'
const siteDescription =
  'Bubatz Club Manager hilft dir dabei, deinen Club zu verwalten.'
const siteUrl = 'https://bubatz.club'

export async function generateMetadata(): Promise<Metadata> {
  const title = `${siteName} Blog | Neueste Einblicke in Cannabis Social Clubs`
  const description = `${siteDescription}. Entdecke in unserem Blog aktuelle Tutorials, Projektideen und Brancheneinblicke zu Cannabis Social Clubs und deren Verwaltung.`

  return {
    title,
    description,
    keywords: ['CSC', 'Cannabis Club', 'CSC Software'],
    authors: [{ name: siteName }],
    metadataBase: new URL(siteUrl),
    openGraph: {
      type: 'website',
      siteName,
      title,
      description,
      url: `${siteUrl}/blog`,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@bubatzclub',
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/blog`,
    },
  }
}

export default function BlogPage() {
  return (
    <section id="blog" className="w-full bg-white py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-start space-y-4">
          <div className="inline-block rounded-lg bg-[#c5f467] px-3 py-1 text-sm font-semibold">
            Blog
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Neueste Beiträge
          </h2>
          <p className="max-w-[900px] text-zinc-500 dark:text-zinc-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Entdecke die neuesten Einblicke, Tipps und Trends rund um Cannabis
            Social Clubs und deren Verwaltung.
          </p>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <Link key={post.slug} href={`/${post.slug}`} className="group">
              <article className="overflow-hidden rounded-3xl border-2 border-black transition-all duration-300 hover:shadow-xl">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={400}
                    height={200}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
                <div className="p-6">
                  <h3 className="mb-2 text-2xl font-bold">{post.title}</h3>
                  <p className="mb-4 text-zinc-500">{post.description}</p>
                  <div className="flex items-center justify-between">
                    <time
                      dateTime={post.date}
                      className="flex items-center text-sm text-zinc-500"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {new Date(post.date).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="flex items-center font-semibold text-[#c5f467]">
                      Weiterlesen <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
