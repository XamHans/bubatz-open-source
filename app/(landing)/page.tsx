import { buttonVariants } from '@/components/ui/button';
import { ExternalLinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/generic/Container';
import { Icons } from './components/Icons';
import Features from './components/features';
import { Testimonials } from './components/testimonials';

export default async function HomePage() {
  8;
  const repoStars = await getRepoStars();

  return (
    <>
      <section className="container flex flex-col items-center justify-center gap-4 py-20">
        <Link
          href="#"
          className="flex items-center space-x-2 rounded-md bg-secondary px-3 py-2 text-sm hover:bg-secondary/80"
        >
          <span>🌱</span>
          <span className="font-medium">
            GrowTrack is now available. Optimize your plant cultivation today!
          </span>
          <ExternalLinkIcon className="h-4 w-4 flex-shrink-0" />
        </Link>
        <Container className="font-heading text-center text-3xl font-bold sm:text-4xl sm:leading-tight md:text-5xl md:leading-tight">
          Streamline Your Plant Cultivation with Intelligent Tracking and Management
        </Container>
        <Container className="text-center text-muted-foreground sm:text-xl">
          GrowTrack empowers cultivators with advanced tools for strain management, 
          batch tracking, and growth phase monitoring. Optimize your yields and 
          streamline operations with our comprehensive plant management solution.
        </Container>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className={buttonVariants({
              className: 'flex items-center gap-2',
            })}
          >
            Start Growing
          </Link>
          <Link
            href="#"
            className={buttonVariants({
              className: 'flex items-center',
            })}
          >
            <Icons.gitHub className="mr-2 h-4 w-4" />
            View Demo
          </Link>
        </div>
      </section>

      <section id="features">
        <Features />
      </section>

      <section id="testimonials" className="md:px-60">
        <Testimonials />
      </section>
    </>
  );
}

async function getRepoStars() {
  const response = await fetch(
    'https://api.github.com/repos/alifarooq9/rapidlaunch',
    {
      next: {
        // run every 15 minutes
        revalidate: 900,
      },
    },
  );

  const data: unknown = await response.json();
  const stars: number = (data as { stargazers_count?: string })
    ?.stargazers_count
    ? Number((data as { stargazers_count?: string }).stargazers_count)
    : 0;

  return stars;
}
