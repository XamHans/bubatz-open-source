import FAQ from './components/faq'
import Features from './components/feat'
import Hero from './components/hero'
import Pricing from './components/pricing'
import Team from './components/team'

export default async function HomePage() {
  return (
    <>
      <Hero />

      <Features />

      <Pricing />

      <Team />

      <FAQ />
    </>
  )
}

async function getRepoStars() {
  const response = await fetch(
    'https://api.github.com/repos/your-repo/bubatz-club-manager',
    {
      next: {
        // run every 15 minutes
        revalidate: 900,
      },
    },
  )

  const data: unknown = await response.json()
  const stars: number = (data as { stargazers_count?: string })
    ?.stargazers_count
    ? Number((data as { stargazers_count?: string }).stargazers_count)
    : 0

  return stars
}
