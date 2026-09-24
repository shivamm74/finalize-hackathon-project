import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/shared/logo"

const links = [
  { label: "How it works", href: "#how" },
  { label: "Platform", href: "#platform" },
  { label: "Impact", href: "#impact" },
  { label: "Partners", href: "#partners" },
]

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            render={<Link href="/login" />}
            className="hidden sm:inline-flex"
          >
            Sign in
          </Button>
          <Button size="sm" render={<Link href="/signup" />}>
            Create account
          </Button>
        </div>
      </div>
    </header>
  )
}
