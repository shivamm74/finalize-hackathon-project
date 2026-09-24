"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Profile } from "@/types/profile"

type State = { error: string | null; message?: string } | null

export function ProfileForm({ profile }: { profile: Profile }) {
  const supabase = createClient()
  const [state, setState] = useState<State>(null)
  const [pending, setPending] = useState(false)

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setState(null)
    const formData = new FormData(event.currentTarget)
    const displayName = String(formData.get("display_name") ?? "").trim()
    const organizationName = String(formData.get("organization_name") ?? "").trim()
    const phone = String(formData.get("phone") ?? "").trim()
    if (displayName.length > 80 || organizationName.length > 120) {
      setState({ error: "Name and organization must be within the allowed length." })
      setPending(false)
      return
    }
    if (phone && !/^\\+?[0-9 ()-]{7,20}$/.test(phone)) {
      setState({ error: "Enter a valid phone number." })
      setPending(false)
      return
    }
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setState({ error: "Your session expired. Please sign in again." })
      setPending(false)
      return
    }
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email ?? null,
      display_name: displayName || user.email?.split("@")[0] || "New user",
      organization_name: organizationName || null,
      phone: phone || null,
      role: String(formData.get("role") ?? "operations"),
      avatar_initials: (displayName || user.email || "U").slice(0, 2).toUpperCase(),
    })
    setPending(false)
    setState(error ? { error: error.message } : { error: null, message: "Profile saved successfully." })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your profile</CardTitle>
        <CardDescription>
          Stored in Supabase and used across donations, matching, and dispatch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={saveProfile} className="grid max-w-xl gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="display_name">Display name</Label>
            <Input
              id="display_name"
              name="display_name"
              defaultValue={profile.display_name}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="organization_name">Organization</Label>
            <Input
              id="organization_name"
              name="organization_name"
              defaultValue={profile.organization_name ?? ""}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              name="role"
              defaultValue={profile.role}
              className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="operations">Operations</option>
              <option value="donor">Donor</option>
              <option value="shelter">Shelter / NGO</option>
              <option value="volunteer">Volunteer</option>
            </select>
          </div>
          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state?.message && <p className="text-sm text-brand">{state.message}</p>}
          <div>
            <Button type="submit" disabled={pending}>
              {pending ? "Saving…" : "Save profile"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
