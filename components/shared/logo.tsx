import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-md bg-brand text-brand-foreground",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-4">
        <path
          d="M5 13c3.5 0 6-2.5 6-6C7.5 7 5 9.5 5 13Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M12 20c0-4.4 3-7.5 7-8-.4 4.6-3 8-7 8Z"
          fill="currentColor"
        />
        <path
          d="M12 20c0-5-2.2-8.7-5-11"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-tight text-foreground">
          FoodFlow
        </span>
      )}
    </span>
  )
}
