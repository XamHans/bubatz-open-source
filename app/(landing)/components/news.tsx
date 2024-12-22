'use client'

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { posts } from '../../../.velite'

export default function NewsSection() {
  const recentPosts = posts.slice(0, 3)
  return (
    <section id="news" className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className=" flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0"
      >
        <div className="rounded-lg bg-[#c5f467] px-3 py-1">
          <h2 className="text-2xl font-bold">News</h2>
        </div>
        <p className="max-w-2xl text-xl">
          Bleib auf dem Laufenden, mit unseren Blogbeiträgen
        </p>
      </motion.div>
      <div className="grid gap-8 px-12 md:grid-cols-3">
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
          className="text-black-foreground inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold transition-colors hover:bg-primary/90"
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
    </Link>
  )
}
