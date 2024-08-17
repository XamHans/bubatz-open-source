import { Container } from '@/components/generic/Container';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export type Feature = {
  title: string;
  description: string;
  image: string;
  imageDark?: string;
};

export const features: Feature[] = [
  {
    title: 'Member Management',
    description:
      'Bubatz Club Manager provides a comprehensive member management system. Easily add, update, and track club members, including their roles, payment history, and cannabis purchase limits.',
    image: 'https://utfs.io/f/43bbc3c8-cf3c-4fae-a0eb-9183f1779489-294m81.png',
    imageDark:
      'https://utfs.io/f/fddea366-51c6-45f4-bd54-84d273ad9fb9-1ly324.png',
  },
  {
    title: 'Cultivation Tracking',
    description:
      'Our cultivation tracking feature allows you to monitor multiple batches and plants simultaneously. Track key metrics, growth phases, and yields for each batch, ensuring optimal cultivation management and compliance.',
    image: 'https://utfs.io/f/805616c1-22b8-4508-9890-9ba9e2867a41-p24dnn.png',
    imageDark:
      'https://utfs.io/f/9074c0de-d9ea-4c0b-9d49-55dca1253a3f-6ig3yq.png',
  },
  {
    title: 'Sales and Inventory Management',
    description:
      'Bubatz Club Manager offers detailed sales and inventory tracking. Record all transactions, monitor stock levels, and ensure compliance with legal purchase limits for each member.',
    image: 'https://utfs.io/f/43bbc3c8-cf3c-4fae-a0eb-9183f1779489-294m81.png',
    imageDark:
      'https://utfs.io/f/fddea366-51c6-45f4-bd54-84d273ad9fb9-1ly324.png',
  },
  {
    title: 'Compliance and Reporting',
    description:
      'Leverage Bubatz Club Manager's built-in compliance features to stay within legal boundaries. Generate reports for authorities, track member purchase history, and maintain accurate records of all club activities.',
    image: 'https://utfs.io/f/72a2c035-69e0-46ca-84a8-446e4dabf77c-3koi6e.png',
    imageDark:
      'https://utfs.io/f/89099112-4273-4375-9e44-1b3394600e21-c6ikq1.png',
  },
];

export default function Features() {
  return (
    <section className="flex flex-col items-center justify-center gap-20 py-20">
      <div className="grid gap-3">
        <h2 className="text-center text-2xl font-bold text-foreground sm:text-3xl">
          Bubatz Club Manager Features
        </h2>
        <Container className="max-w-2xl text-center text-base text-muted-foreground sm:text-xl">
          Our features are designed to help you manage your cannabis club efficiently and in compliance with German regulations.
        </Container>
      </div>
      <div className="grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {features.map((feature, idx) => (
          <FeatureCard key={feature.title + idx} index={idx + 1} {...feature} />
        ))}
      </div>
    </section>
  );
}

type FeatureCardProps = Feature & {
  index: number;
};

function FeatureCard({
  title,
  description,
  image,
  imageDark,
  index,
}: FeatureCardProps) {
  return (
    <div className="grid gap-10 rounded-[25px] border border-border bg-muted/50 p-10 transition-colors duration-300 hover:bg-muted/20 md:grid-cols-1">
      <div
        className={cn(
          '-m-2 w-full rounded-xl bg-foreground/5 p-2 ring-1 ring-inset ring-foreground/10 lg:rounded-2xl',
          index % 2 === 0 ? 'order-1' : 'order-2',
        )}
      >
        <div className="relative aspect-video w-full rounded-md bg-muted">
          <Image
            src={image}
            alt={title}
            fill
            className={cn(
              'block rounded-md border border-border',
              imageDark && 'dark:hidden',
            )}
            priority
          />

          {imageDark && (
            <Image
              src={imageDark}
              alt={title}
              fill
              className="hidden rounded-md border border-border dark:block"
              priority
            />
          )}
        </div>
      </div>

      <div
        className={cn(
          'order-1 flex flex-col gap-2',
          index % 2 === 0 ? 'order-2' : 'order-1',
        )}
      >
        <h3 className="text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h3>
        <Container className="text-base text-muted-foreground">
          {description}
        </Container>
      </div>
    </div>
  );
}
