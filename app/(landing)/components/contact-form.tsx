'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { FormEvent, useState } from 'react'
import { toast } from 'sonner'

export default function ContactForm() {
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('https://submit-form.com/wGgPf0pQ', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (response.ok) {
        form.reset()
        setShowSuccess(true)
        toast('Nachricht erfolgreich gesendet!')
        setTimeout(() => setShowSuccess(false), 5000)
      } else {
        throw new Error('Fehler beim Senden der Nachricht')
      }
    } catch (error) {
      toast(
        'Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.',
      )
      console.error(error)
    }
  }

  return (
    <section className="max-w-8xl mx-auto px-4 py-16 sm:px-6 lg:px-6">
      <div className="rounded-xl bg-[#F3F3F3] p-6 pt-12 shadow-sm">
        {showSuccess && (
          <Alert className="mb-8 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen
              melden.
            </AlertDescription>
          </Alert>
        )}

        <div className=" flex flex-col items-start space-y-3 md:flex-row md:items-center md:space-x-6 md:space-y-0">
          <div className="rounded-lg bg-[#c5f467] px-6 py-3">
            <h2 className="text-2xl font-bold text-black">Schreib uns</h2>
          </div>
          <p className="text-lg text-gray-700">
            einfach eine Nachricht und lass uns herausfinden, was genau du
            brauchst.
          </p>
        </div>

        <div className="flex flex-col gap-12 md:flex-row md:items-center">
          <form onSubmit={handleSubmit} className="flex-1 space-y-8 pt-4">
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Name*
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c5f467]"
                  placeholder="Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c5f467]"
                  placeholder="Email"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Nachricht*
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c5f467]"
                  placeholder="Nachricht"
                ></textarea>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#b6f36e] px-8 py-4 text-lg font-bold text-black transition-colors hover:bg-[#a5e45d] min-[400px]:w-auto md:text-xl"
            >
              Nachricht senden
            </Button>
          </form>

          <div className="relative flex-1 md:flex">
            <Image
              src="/landing/contact-image.png"
              alt="People working on laptops"
              width={400}
              height={400}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
