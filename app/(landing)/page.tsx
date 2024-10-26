import AnimatedSection from '@/components/generic/animated-section'
import ContactForm from './components/contact-form'
import FAQ from './components/faq'
import Features from './components/features'
import Hero from './components/hero'
import NewsSection from './components/news'
import Pricing from './components/pricing'
import Team from './components/team'

export default async function HomePage() {
  return (
    <>
      <AnimatedSection>
        <Hero />
      </AnimatedSection>

      <AnimatedSection>
        <Features />
      </AnimatedSection>

      <AnimatedSection>
        <Pricing />
      </AnimatedSection>

      <AnimatedSection>
        <Team />
      </AnimatedSection>

      <AnimatedSection>
        <NewsSection />
      </AnimatedSection>

      <AnimatedSection>
        <FAQ />
      </AnimatedSection>

      <AnimatedSection>
        <ContactForm />
      </AnimatedSection>
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
