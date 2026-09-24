"use client"

import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const alerts = [
  { href: "/donations/FD-1048", title: "FD-1048 needs a match", body: "45 vegetarian meals · expires soon" },
  { href: "/donations/FD-1045", title: "FD-1045 at risk", body: "Produce boxes · 1h remaining" },
  { href: "/matches", title: "3 recommended matches", body: "Ready to assign in Matching Center" },
]

export function TopBarActions({ initials }: { initials: string }) {
  return (
    <div className="ml-auto flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-brand" />
              <span className="sr-only">Notifications</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {alerts.map((a) => (
              <DropdownMenuItem key={a.href} render={<Link href={a.href} />}>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{a.title}</span>
                  <span className="text-xs text-muted-foreground">{a.body}</span>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/settings"
        className="hidden items-center gap-2 sm:flex"
        aria-label="Open settings"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
          {initials}
        </span>
      </Link>

      <Button
        size="sm"
        render={<Link href="/donations/new" />}
        className="sm:hidden"
      >
        New
      </Button>
    </div>
  )
}
