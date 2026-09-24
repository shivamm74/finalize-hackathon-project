function stripRestSuffix(url: string) {
  return url.replace(/\/rest\/v1\/?$/i, "").replace(/\/$/, "")
}

export function getSupabaseUrl() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL.")
  }
  return stripRestSuffix(url)
}

export function getSupabaseAnonKey() {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ""
  if (!key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY.")
  }
  return key
}
