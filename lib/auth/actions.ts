"use server"

import { headers } from "next/headers"
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

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Enter a valid email address." }
  }

  const supabase = await createClient()
  const requestHeaders = await headers()
  const forwardedHost = requestHeaders.get("x-forwarded-host")
  const forwardedProto = requestHeaders.get("x-forwarded-proto") ?? "https"
  const origin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : requestHeaders.get("origin") ?? "http://localhost:3000"

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
    const message = error.message.toLowerCase().includes("already registered")
      ? "This email is already registered. Sign in instead."
      : error.message
    return { error: message }
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
