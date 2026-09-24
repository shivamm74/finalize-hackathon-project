import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Profile, UserRole } from "@/types/profile"

const roles: UserRole[] = ["operations", "donor", "shelter", "volunteer"]

function asRole(value: unknown): UserRole {
  const role = String(value ?? "operations")
  return roles.includes(role as UserRole) ? (role as UserRole) : "operations"
}

export async function getCurrentProfile(): Promise<Profile | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (data) return data as Profile
    if (error && !error.message.toLowerCase().includes("schema cache")) {
      console.error("[v0] Profile lookup failed:", error.message)
    }

    const fallback: Profile = {
    id: user.id,
    email: user.email ?? null,
    display_name:
      (user.user_metadata?.display_name as string | undefined) ??
      user.email?.split("@")[0] ??
      "New user",
    role: asRole(user.user_metadata?.role ?? "operations"),
    organization_name:
      (user.user_metadata?.organization_name as string | undefined) ?? null,
    phone: null,
    avatar_initials: (user.email ?? "U").slice(0, 2).toUpperCase(),
    created_at: user.created_at,
    updated_at: user.created_at,
  }

  const { error: upsertError } = await supabase.from("profiles").upsert({
    id: fallback.id,
    email: fallback.email,
    display_name: fallback.display_name,
    role: fallback.role,
    organization_name: fallback.organization_name,
    avatar_initials: fallback.avatar_initials,
  })

  if (upsertError && !upsertError.message.toLowerCase().includes("schema cache")) {
    console.error("[v0] Profile persistence failed:", upsertError.message)
  }

    return fallback
  } catch (error) {
    console.error("[v0] Profile session unavailable:", error)
    return null
  }
}

