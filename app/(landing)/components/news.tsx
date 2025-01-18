'use client'

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { posts } from '../../../.velite'

export default function NewsSection() {
  const recentPosts = posts.slice(0, 3)

  return (
    <section id="news" className="w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col space-y-4">
          <div className="inline-block w-fit rounded-lg bg-[#c5f467] px-3 py-1.5">
            <span className="font-semibold">News</span>
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
            Blog
          </h2>

          <p className="max-w-[900px] text-xl text-zinc-500 md:text-lg lg:text-xl">
            Bleib auf dem Laufenden, mit unseren Blogbeiträgen
          </p>
        </div>

        <div className="mt-8 md:mt-12">
          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post: any) => (
              <div key={post.slug} className="w-full">
                <BlogPostCard
                  title={post.title}
                  date={post.date}
                  excerpt={post.description}
                  slug={post.slug}
                  image={post.image}
                  tags={post.tags}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 font-semibold text-black transition-colors hover:bg-primary/90"
          >
            Alle Beiträge ansehen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export interface BlogPostCardProps {
  title: string
  date: string
  excerpt?: string
  slug: string
  image?: string
  tags?: string[]
}

export function BlogPostCard({
  title,
  date,
  excerpt,
  slug,
  image,
  tags,
}: BlogPostCardProps) {
  const fallbackImage = '/images/default-blog-image.jpg'

  return (
    <Link href={`/${slug}`} className="block">
      <CardContainer className="inter-var">
        <CardBody className="group/card relative h-full rounded-xl border border-black/[0.1] p-3 transition-colors dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] sm:p-4">
          <CardItem
            translateZ="50"
            className="text-base font-bold text-neutral-600 dark:text-white sm:text-lg"
          >
            {title}
          </CardItem>

          <CardItem translateZ="100" className="mt-3 w-full">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
              <Image
                src={image || fallbackImage}
                alt={title}
                fill
                className="object-cover transition-transform duration-300 group-hover/card:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                priority
              />
            </div>
          </CardItem>

          {excerpt && (
            <CardItem
              translateZ="60"
              className="mt-3 text-xs text-neutral-500 dark:text-neutral-300"
            >
              {excerpt}
            </CardItem>
          )}

          <div className="mt-4 flex items-center justify-between sm:mt-6">
            <CardItem
              translateZ={20}
              as="button"
              className="rounded-xl bg-black px-2 py-1 text-xs font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black sm:px-3 sm:py-1.5"
            >
              Jetzt lesen
            </CardItem>

            {date && (
              <CardItem
                translateZ={20}
                className="text-xs text-neutral-500 dark:text-neutral-400"
              >
                {new Date(date).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </CardItem>
            )}
          </div>
        </CardBody>
      </CardContainer>
    </Link>
  )
}
