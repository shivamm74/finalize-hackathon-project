"use client"

import { useActionState } from "react"
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
import { updateProfileAction } from "@/lib/auth/actions"
import type { Profile } from "@/types/profile"

type State = { error: string | null; message?: string } | null

export function ProfileForm({ profile }: { profile: Profile }) {
  async function action(_: State, formData: FormData): Promise<State> {
    return updateProfileAction(formData)
  }

  const [state, formAction, pending] = useActionState(action, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your profile</CardTitle>
        <CardDescription>
          Stored in Supabase and used across donations, matching, and dispatch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="grid max-w-xl gap-4">
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
