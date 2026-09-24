import type { MapMarker } from "@/components/shared/simulated-map"
import { donations, recipients, volunteers } from "@/lib/mock-data"
import { statusLabels } from "@/lib/format"

/** Build a full set of network markers for the live map. */
export function buildNetworkMarkers(): MapMarker[] {
  const donationMarkers: MapMarker[] = donations
    .filter((d) => d.status !== "delivered")
    .map((d) => ({
      id: `donation:${d.id}`,
      x: d.location.x,
      y: d.location.y,
      label: `${d.donor.name} — ${d.foodName} (${statusLabels[d.status]})`,
      kind: "donation" as const,
      atRisk: d.status === "at_risk",
    }))

  const recipientMarkers: MapMarker[] = recipients.map((r) => ({
    id: `recipient:${r.id}`,
    x: r.location.x,
    y: r.location.y,
    label: `${r.name} — ${r.currentLoad}/${r.capacity} capacity`,
    kind: "recipient" as const,
  }))

  const volunteerMarkers: MapMarker[] = volunteers
    .filter((v) => v.status !== "offline")
    .map((v) => ({
      id: `volunteer:${v.id}`,
      x: v.location.x,
      y: v.location.y,
      label: `${v.name} — ${v.status === "on_pickup" ? "on pickup" : "available"}`,
      kind: "volunteer" as const,
      active: v.status === "on_pickup",
    }))

  return [...recipientMarkers, ...donationMarkers, ...volunteerMarkers]
}
