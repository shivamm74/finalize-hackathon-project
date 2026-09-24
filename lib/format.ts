import type {
  DonationStatus,
  DietaryType,
  Urgency,
  VolunteerStatus,
  RecipientStatus,
  FoodCategory,
  VehicleType,
} from "@/types"

export const statusLabels: Record<DonationStatus, string> = {
  needs_match: "Needs Match",
  matched: "Matched",
  driver_assigned: "Driver Assigned",
  pickup_in_progress: "Pickup In Progress",
  delivered: "Delivered",
  at_risk: "At Risk",
}

export const dietaryLabels: Record<DietaryType, string> = {
  vegetarian: "Vegetarian",
  vegan: "Vegan",
  non_vegetarian: "Non-vegetarian",
  halal: "Halal",
  gluten_free: "Gluten-free",
}

export const categoryLabels: Record<FoodCategory, string> = {
  prepared: "Prepared meals",
  produce: "Produce",
  bakery: "Bakery",
  dairy: "Dairy",
  packaged: "Packaged",
  beverages: "Beverages",
}

export const urgencyLabels: Record<Urgency, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
}

export const volunteerStatusLabels: Record<VolunteerStatus, string> = {
  available: "Available",
  on_pickup: "On Pickup",
  offline: "Offline",
}

export const vehicleLabels: Record<VehicleType, string> = {
  car: "Car",
  bike: "Bike",
  scooter: "Scooter",
  van: "Van",
  on_foot: "On foot",
}

export const recipientStatusLabels: Record<RecipientStatus, string> = {
  accepting: "Accepting",
  near_capacity: "Near capacity",
  full: "Full",
  closed: "Closed",
}

/** Badge variant per donation status */
export function statusVariant(
  status: DonationStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "delivered":
      return "secondary"
    case "at_risk":
      return "destructive"
    case "needs_match":
      return "outline"
    default:
      return "default"
  }
}

/**
 * Countdown text from now until an ISO timestamp.
 * Returns { text, expired, critical } where critical means < 90 min left.
 */
export function timeUntil(iso: string, now: Date = new Date()) {
  const target = new Date(iso).getTime()
  const diffMs = target - now.getTime()
  const expired = diffMs <= 0
  const absMin = Math.max(0, Math.round(Math.abs(diffMs) / 60000))
  const h = Math.floor(absMin / 60)
  const m = absMin % 60
  const text = h > 0 ? `${h}h ${m}m` : `${m}m`
  return { text, expired, critical: !expired && diffMs < 90 * 60000, minutes: absMin }
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function formatRelative(iso: string, now: Date = new Date()): string {
  const diff = now.getTime() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return "just now"
  if (min < 60) return `${min}m ago`
  const h = Math.round(min / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.round(h / 24)
  return `${d}d ago`
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US").format(n)
}
