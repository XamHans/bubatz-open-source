'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, Star } from 'lucide-react'
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
    <div className="mx-auto w-full max-w-6xl rounded-xl bg-[#F3F3F3] ">
      {showSuccess && (
        <Alert className="mb-6 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen
            melden.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-8 flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="rounded-lg bg-[#c5f467] px-4 py-2">
          <h2 className="text-2xl font-bold text-black">Schreib uns</h2>
        </div>
        <p className="text-lg text-gray-700">
          einfach eine Nachricht und lass uns herausfinden, was genau du
          brauchst.
        </p>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c5f467]"
              placeholder="Name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c5f467]"
              placeholder="Email"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Nachricht*
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c5f467]"
              placeholder="Nachricht"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-[#1e1b4b] px-4 py-2 text-white transition-colors duration-300 hover:bg-[#2e2a5b]"
          >
            Nachricht senden
          </button>
        </form>

        <div className="relative hidden flex-1 md:block">
          <div className="absolute right-[55px] top-[25px]">
            <Star className="h-24 w-24 text-[#1e1b4b]" fill="#1e1b4b" />
          </div>
          <div className="absolute bottom-[50px] left-[50px]">
            <Star className="h-24 w-24 text-[#c5f467]" fill="#c5f467" />
          </div>
          <Image
            src="/landing/contact-image.png"
            alt="People working on laptops"
            width={400}
            height={400}
            className="mx-auto rounded-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
