import rehypeSlug from 'rehype-slug'
import { defineCollection, defineConfig, s } from 'velite'

const computedFields = <T extends { slug: string }>(data: T) => ({
  ...data,
  slugAsParams: data.slug.split('/').slice(1).join('/'),
})

const posts = defineCollection({
  name: 'Post',
  pattern: 'blog/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      date: s.isodate(),
      published: s.boolean().default(true),
      authors: s.array(s.string()),
      body: s.mdx(),
    })
    .transform(computedFields),
})

const authors = defineCollection({
  name: 'Author',
  pattern: 'authors/**/*.mdx',
  schema: s
    .object({
      slug: s.path(),
      title: s.string().max(99),
      description: s.string().max(999).optional(),
      avatar: s.string().max(99),
      twitter: s.string().max(99),
      body: s.mdx(),
    })
    .transform(computedFields),
})

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { authors, posts },
  mdx: {
    rehypePlugins: [rehypeSlug as any],
  },
})
