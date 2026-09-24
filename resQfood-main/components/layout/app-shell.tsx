"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { Menu, Plus, Search, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet"
import { Logo } from "@/components/shared/logo"
import { SidebarNav } from "./sidebar-nav"
import { TopBarActions } from "./top-bar-actions"
import { UserMenu } from "@/components/auth/user-menu"
import type { Profile } from "@/types/profile"

function SidebarInner({
  onNavigate,
  profile,
}: {
  onNavigate?: () => void
  profile: Profile
}) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center justify-between px-1.5 pt-1">
        <Link href="/" onClick={onNavigate}>
          <Logo />
        </Link>
      </div>

      <Button
        render={<Link href="/donations/new" onClick={onNavigate} />}
        className="justify-start"
      >
        <Plus data-icon="inline-start" />
        New donation
      </Button>

      <SidebarNav onNavigate={onNavigate} />

      <div className="mt-auto flex flex-col gap-3">
        <div className="rounded-lg border bg-muted/40 p-3">
          <div className="flex items-center gap-2 text-xs font-medium text-foreground">
            <Circle className="size-2 fill-brand text-brand" />
            Online
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Bay Area Food Rescue · all systems operational
          </p>
        </div>
        <UserMenu profile={profile} />
      </div>
    </div>
  )
}

export function AppShell({
  children,
  profile,
}: {
  children: ReactNode
  profile: Profile
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-sidebar lg:block">
        <SidebarInner profile={profile} />
      </aside>

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu />
                  <span className="sr-only">Open navigation</span>
                </Button>
              }
            />
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarInner profile={profile} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <Logo className="lg:hidden" showWordmark={false} />

          <div className="relative hidden max-w-sm flex-1 items-center sm:flex">
            <Search className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search donations, recipients…"
              className="h-9 w-full rounded-md border border-input bg-muted/30 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <TopBarActions initials={(profile.avatar_initials || profile.display_name).slice(0, 2).toUpperCase()} />
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
