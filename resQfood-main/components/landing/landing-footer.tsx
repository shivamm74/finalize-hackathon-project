import Link from "next/link"
import { Logo } from "@/components/shared/logo"

const groups = [
  {
    title: "Platform",
    links: ["Dashboard", "Live map", "Matching engine", "Analytics"],
  },
  {
    title: "Community",
    links: ["Donors", "Recipients", "Volunteers", "Partners"],
  },
  {
    title: "Company",
    links: ["About", "Impact report", "Careers", "Contact"],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground text-pretty">
            Connecting surplus food with the people who need it — before it goes
            to waste.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title} className="flex flex-col gap-3">
            <span className="text-sm font-medium">{g.title}</span>
            <ul className="flex flex-col gap-2">
              {g.links.map((l) => (
                <li key={l}>
                  <Link
                    href="/dashboard"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} FoodFlow. All rights reserved.</span>
          <span>Built to end avoidable food waste.</span>
        </div>
      </div>
    </footer>
  )
}
