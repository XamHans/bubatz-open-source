import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { posts } from '../../../.velite'

export default function NewsSection() {
  // Get the 3 most recent posts
  const recentPosts = posts.slice(0, 3)
  return (
    <section id="news" className="w-full ">
      <div className="mb-8 flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
        <div className="rounded-lg bg-[#c5f467] px-3 py-1">
          <h2 className="text-2xl font-bold">News</h2>
        </div>
        <p className="text-xl text-muted-foreground">
          Bleiben auf dem Laufenden mit unseren neuesten Blogbeiträgen und
          Ankündigungen
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
          Alle Beiträge ansehen
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}

function BlogPostCard({ title, date, excerpt, slug, tags }) {
  return (
    <Link href={`/${slug}`} className="block h-full">
      <CardContainer key={title} className="inter-var">
        <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] sm:w-[30rem]">
          <CardItem
            translateZ="50"
            className="text-xl font-bold text-neutral-600 dark:text-white"
          >
            {title}
          </CardItem>
          <CardItem
            as="p"
            translateZ="60"
            className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
          >
            {date}
          </CardItem>
          <CardItem translateZ="100" className="mt-4 w-full">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop"
              height="1000"
              width="1000"
              className="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="mt-20 flex items-center justify-between">
            <CardItem
              translateZ={20}
              translateX={40}
              as="button"
              className="rounded-xl bg-black px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-black"
            >
              Jetzt lesen
            </CardItem>
          </div>
        </CardBody>
      </CardContainer>
      {/* <article className="relative flex h-full flex-col justify-between rounded-[2rem] border-2 border-black bg-card p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
        <div className="mb-4">
          <h3 className="mb-2 text-xl font-semibold">{title}</h3>
          <time
            dateTime={date}
            className="mb-2 block text-sm text-muted-foreground"
          >
            {new Date(date).toLocaleDateString('de-DE', {
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
          Weiterlesen
          <ArrowRight className="ml-1 h-4 w-4" />
        </div>
      </article> */}
    </Link>
  )
}
