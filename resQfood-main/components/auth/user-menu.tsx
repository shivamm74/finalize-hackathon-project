"use client"

import Link from "next/link"
import { signOutAction } from "@/lib/auth/actions"
import type { Profile } from "@/types/profile"

export function UserMenu({ profile }: { profile: Profile }) {
  const initials = (profile.avatar_initials || profile.display_name.slice(0, 2)).toUpperCase()

  return (
    <div className="flex flex-col gap-3">
      <Link
        href="/settings"
        className="flex items-center gap-2.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/60"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
          {initials}
        </span>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">{profile.display_name}</span>
          <span className="truncate text-xs text-muted-foreground">
            {profile.email ?? profile.role}
          </span>
        </div>
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className="w-full rounded-md px-2.5 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
        >
          Sign out
        </button>
      </form>
    </div>
  )
}
