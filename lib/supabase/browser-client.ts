import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient>;

function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase URL and/or Anon Key not provided');
  }

  client = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  return client;
}

export default getSupabaseBrowserClient;
