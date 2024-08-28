interface HeroProps {
  title: string
  description: string
}

function Hero({ title, description }: HeroProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

export { Hero }
