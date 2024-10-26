import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { posts } from '../../../.velite'

export default function NewsSection() {
  // Get the 3 most recent posts
  const recentPosts = posts.slice(0, 3)

  return (
    <section id="news" className="w-full bg-white py-12 md:py-24 lg:py-16">
      <div className="container px-4 md:px-6">
        <div className="mb-8 flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
          <div className="rounded-lg bg-[#c5f467] px-3 py-1">
            <h2 className="text-2xl font-bold">News</h2>
          </div>
          <p className="text-xl text-muted-foreground">
            Stay updated with our latest blog posts and announcements
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {recentPosts.map((post: any) => (
            <BlogPostCard
              key={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.description}
              slug={post.slug}
              tags={post.tags}
            />
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            View all posts
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function BlogPostCard({ title, date, excerpt, slug, tags }) {
  return (
    <Link href={`/${slug}`} className="block h-full">
      <article className="relative flex h-full flex-col justify-between rounded-[2rem] border-2 border-black bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <time
            dateTime={date}
            className="mb-2 block text-sm text-muted-foreground"
          >
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <p className="text-sm text-muted-foreground">{excerpt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags?.map((tag) => (
              <span
                key={tag}
                className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="inline-flex items-center text-sm font-semibold text-primary hover:underline">
          Read more
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </article>
    </Link>
  )
}
