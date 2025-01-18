'use client'

import { BlogPostCard } from '../(landing)/components/news'
import { posts } from '../../.velite'

type Post = {
  slug: string
  slugAsParams: string
  title: string
  description: string
  date: string
  tags: string[]
  image?: string
}

export default function BlogPage() {
  return (
    <section
      id="blog"
      className="w-full bg-white px-4 py-8 sm:px-6 md:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4">
          <div className="inline-block w-fit rounded-lg bg-[#c5f467] px-3 py-1.5">
            <span className="font-semibold">Blog</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Neueste Beiträge
          </h2>

          <p className="max-w-[900px] text-xl text-zinc-500 md:text-lg lg:text-xl">
            Entdecke die neuesten Einblicke, Tipps und Trends rund um Cannabis
            Social Clubs und deren Verwaltung.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <BlogPostCard
              key={post.slug}
              title={post.title}
              date={post.date}
              excerpt={post.description}
              slug={post.slug}
              image={post.image}
              tags={post.tags}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
