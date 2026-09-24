import {
  LayoutDashboard,
  Utensils,
  GitMerge,
  Bike,
  Building2,
  BarChart3,
  Settings,
  type LucideIcon,
} from "lucide-react"

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Donations", href: "/donations", icon: Utensils },
  { label: "Matching", href: "/matches", icon: GitMerge },
  { label: "Volunteers", href: "/volunteers", icon: Bike },
  { label: "Recipients", href: "/recipients", icon: Building2 },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
]
