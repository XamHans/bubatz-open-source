'use client'

import { CardBody, CardContainer, CardItem } from '@/components/ui/3d-card'
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

// export async function generateMetadata(): Promise<Metadata> {
//   const title = `${siteName} Blog | Neueste Einblicke in Cannabis Social Clubs`
//   const description = `${siteDescription}. Entdecke in unserem Blog aktuelle Tutorials, Projektideen und Brancheneinblicke zu Cannabis Social Clubs und deren Verwaltung.`

//   return {
//     title,
//     description,
//     keywords: ['CSC', 'Cannabis Club', 'CSC Software'],
//     authors: [{ name: siteName }],
//     metadataBase: new URL(siteUrl),
//     openGraph: {
//       type: 'website',
//       siteName,
//       title,
//       description,
//       url: `${siteUrl}/blog`,
//     },
//     twitter: {
//       card: 'summary_large_image',
//       site: '@bubatzclub',
//       title,
//       description,
//     },
//     alternates: {
//       canonical: `${siteUrl}/blog`,
//     },
//   }
// }

export default function BlogPage() {
  return (
    <section id="blog" className="container w-full bg-white py-12">
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
          <Link key={post.slug} href={`/${post.slug}`} className="block h-full">
            <CardContainer key={post.title} className="inter-var">
              <CardBody className="group/card relative h-auto w-auto rounded-xl border border-black/[0.1] p-6 dark:border-white/[0.2] dark:bg-black dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] sm:w-[30rem]">
                <CardItem
                  translateZ="50"
                  className="text-xl font-bold text-neutral-600 dark:text-white"
                >
                  {post.title}
                </CardItem>
                <CardItem
                  as="p"
                  translateZ="60"
                  className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-300"
                >
                  {post.description}
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
        ))}
      </div>
    </section>
  )
}
