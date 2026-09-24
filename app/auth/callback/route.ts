import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      const loginUrl = new URL("/login", origin)
      loginUrl.searchParams.set("error", "The confirmation link is invalid or expired. Please sign in again.")
      return NextResponse.redirect(loginUrl)
    }
  }

  const url = new URL(next.startsWith("/") ? next : "/dashboard", origin)
  return NextResponse.redirect(url)
}
