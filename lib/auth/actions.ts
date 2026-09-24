"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { Profile, UserRole } from "@/types/profile"

const roles: UserRole[] = ["operations", "donor", "shelter", "volunteer"]

function asRole(value: FormDataEntryValue | null): UserRole {
  const role = String(value ?? "operations")
  return roles.includes(role as UserRole) ? (role as UserRole) : "operations"
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const next = String(formData.get("next") ?? "/dashboard")

  if (!email || !password) {
    return { error: "Email and password are required." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect(next.startsWith("/") ? next : "/dashboard")
}

export async function signUpAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const displayName = String(formData.get("display_name") ?? "").trim()
  const organizationName = String(formData.get("organization_name") ?? "").trim()
  const role = asRole(formData.get("role"))

  if (!email || !password) {
    return { error: "Email and password are required." }
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." }
  }

  const supabase = await createClient()
  const origin = process.env.NEXT_PUBLIC_SITE_URL

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName || email.split("@")[0],
        organization_name: organizationName || null,
        role,
      },
      emailRedirectTo: origin ? `${origin}/auth/callback` : undefined,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.session) {
    return {
      error: null,
      message: "Check your email to confirm your account, then sign in.",
    }
  }

  redirect("/dashboard")
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be signed in." }
  }

  const displayName = String(formData.get("display_name") ?? "").trim()
  const organizationName = String(formData.get("organization_name") ?? "").trim()
  const phone = String(formData.get("phone") ?? "").trim()
  const role = asRole(formData.get("role"))

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: displayName || user.email?.split("@")[0] || "New user",
      organization_name: organizationName || null,
      phone: phone || null,
      role,
      avatar_initials: (displayName || user.email || "U").slice(0, 2).toUpperCase(),
    })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  return { error: null, message: "Profile saved." }
}
