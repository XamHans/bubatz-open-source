/**
 * Creates a Supabase server client instance for server-side usage.
 * Caches the client for performance.
 * Handles cookies for session management.
 * Also exports a Supabase admin client using the service role key.
 */
import { cookies } from 'next/headers'
import { cache } from 'react'

import { createServerClient } from '@supabase/ssr'

const keys = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
}

const getServerSupabaseClient = cache(() => {
  if (!keys.url || !keys.anonKey) {
    throw new Error(
      'Can not create Server Supabase Client: Supabase URL and/or Anon Key not provided',
    )
  }

  return createServerClient(keys.url, keys.anonKey, {
    cookies: getCookiesStrategy(),
  })
})

const getSupabaseServerAdminClient = cache(() => {
  if (!keys.serviceRoleKey || !keys.url) {
    throw new Error('Supabase Service Role Key not provided')
  }

  return createServerClient(keys.url, keys.serviceRoleKey, {
    auth: {
      persistSession: false,
    },
    cookies: {},
  })
})

function getCookiesStrategy() {
  const cookieStore = cookies()

  return {
    get: (name: string) => {
      return cookieStore.get(name)?.value
    },
    set: (name: string, value: string, options: any) => {
      cookieStore.set({ name, value, ...options })
    },
    remove: (name: string, options: any) => {
      cookieStore.set({
        name,
        value: '',
        ...options,
      })
    },
  }
}

export { getServerSupabaseClient, getSupabaseServerAdminClient }
