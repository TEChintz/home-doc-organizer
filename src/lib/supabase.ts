import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser-side Supabase client, used only for authentication. All document data
 * goes through the Docket API, which validates the JWT this issues.
 *
 * The anon key is public by design — it grants nothing on its own, because every
 * table has row level security enabled with no policies.
 */
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
  }
  client ??= createClient(url as string, anonKey as string, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}

/** Current access token, or null when signed out. */
export async function getAccessToken(): Promise<string | null> {
  if (!isSupabaseConfigured) return null;
  const { data } = await getSupabase().auth.getSession();
  return data.session?.access_token ?? null;
}
