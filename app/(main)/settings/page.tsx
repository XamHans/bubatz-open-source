'use client'

import LocaleSwitcher from '@/components/generic/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'

export default function Component() {
  const [language, setLanguage] = useState('en')

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-8">
        <h1 className="mb-2 text-4xl font-bold">Settings</h1>
        <p className="mb-8 text-muted-foreground">
          Manage your account settings and set language preferences.
        </p>

        <div className="grid grid-cols-4 gap-8">
          <div className="col-span-1">
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start bg-accent"
              >
                Language
              </Button>
            </nav>
          </div>

          <div className="col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>
                  Set your preferred language for the interface.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <LocaleSwitcher />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
