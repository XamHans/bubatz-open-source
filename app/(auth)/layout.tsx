import { HoverInfoButton } from '@/components/generic/hover-button-cta'
import * as React from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps): JSX.Element {
  return (
    <div className="flex h-auto min-h-screen w-full items-center justify-center">
      {children}

      <HoverInfoButton
        buttonText="Jetzt kostenlos testen"
        infoText="In 30 Sekunden loslegen"
        ctaText="Teste den Bubatz Club Manager mit Demo-Zugangsdaten und überzeuge dich von der einfachen Verwaltung deines Cannabis Social Clubs. Keine Installation notwendig."
        link="/signin"
      />
    </div>
  )
}
