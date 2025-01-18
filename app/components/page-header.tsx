import { cn } from '@/lib/utils'

interface DocsPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string
  text?: string
}

export function DocsPageHeader({
  heading,
  text,
  className,
  ...props
}: DocsPageHeaderProps) {
  return (
    <>
      <div
        className={cn(
          'space-y-2 pb-4 sm:space-y-3 sm:pb-6 md:space-y-4',
          className,
        )}
        {...props}
      >
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
          {heading}
        </h1>
        {text && (
          <p className="text-base text-muted-foreground sm:text-lg md:text-xl">
            {text}
          </p>
        )}
      </div>
      <hr className="mb-6 mt-4 sm:mb-8 sm:mt-6" />
    </>
  )
}
