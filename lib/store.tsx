"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { donations as seedDonations, recipients as seedRecipients, volunteers as seedVolunteers } from "@/lib/mock-data"
import { createClient } from "@/lib/supabase/client"
import type { Donation, DonationStatus, Recipient, Volunteer, VolunteerStatus } from "@/types"

const flow: DonationStatus[] = ["matched", "driver_assigned", "pickup_in_progress", "delivered"]

function donationFromRow(row: any): Donation {
  return {
    id: row.id,
    code: row.code,
    donor: { id: row.organization_id ?? row.created_by ?? row.id, name: row.donor_name, type: row.donor_type, address: row.donor_address ?? "" },
    foodName: row.food_name,
    category: row.category,
    quantity: Number(row.quantity),
    unit: row.unit,
    dietary: row.dietary ?? [],
    preparedAt: row.prepared_at ?? row.created_at,
    safeUntil: row.safe_until ?? row.created_at,
    description: row.description ?? undefined,
    handlingNotes: row.handling_notes ?? undefined,
    status: row.status,
    urgency: row.urgency,
    distanceKm: row.distance_km == null ? undefined : Number(row.distance_km),
    recipientId: row.recipient_id ?? undefined,
    volunteerId: row.volunteer_id ?? undefined,
    matchScore: row.match_score == null ? undefined : Number(row.match_score),
    createdAt: row.created_at,
    location: { x: row.map_x ?? 50, y: row.map_y ?? 50, label: row.donor_address ?? "Donation location" },
  }
}

export interface Store {
  donations: Donation[]
  recipients: Recipient[]
  volunteers: Volunteer[]
  loading: boolean
  addDonation: (d: Donation) => Promise<Donation>
  assign: (donationId: string, recipientId: string, volunteerId?: string) => Promise<void>
  advance: (donationId: string) => Promise<void>
  setVolunteerStatus: (id: string, s: VolunteerStatus) => Promise<void>
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState<Donation[]>(seedDonations)
  const [recipients] = useState(seedRecipients)
  const [volunteers, setVolunteers] = useState<Volunteer[]>(seedVolunteers)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let active = true
    async function load() {
      const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false })
      if (active && !error && data) setDonations(data.map(donationFromRow))
      if (error && !error.message.toLowerCase().includes("schema cache")) {
        console.error("[v0] Could not load donations:", error.message)
      }
      setLoading(false)
    }
    void load()
    return () => { active = false }
  }, [supabase])

  const addDonation = useCallback(async (d: Donation) => {
    let { data: { user } } = await supabase.auth.getUser()

    // Refresh once because a valid server-rendered session can be stale in the
    // browser client immediately after login or email confirmation.
    if (!user) {
      const refreshed = await supabase.auth.refreshSession()
      user = refreshed.data.user
    }

    if (!user) throw new Error("Your session expired. Refresh the page and sign in again.")

    const { data, error } = await supabase.from("donations").insert({
      code: d.code, created_by: user.id, donor_name: d.donor.name, donor_type: d.donor.type,
      donor_address: d.donor.address, food_name: d.foodName, category: d.category, quantity: d.quantity,
      unit: d.unit, dietary: d.dietary, prepared_at: d.preparedAt, safe_until: d.safeUntil,
      description: d.description, handling_notes: d.handlingNotes, status: d.status, urgency: d.urgency,
      distance_km: d.distanceKm, recipient_id: d.recipientId ?? null, volunteer_id: d.volunteerId ?? null,
      match_score: d.matchScore ?? null, map_x: d.location.x, map_y: d.location.y,
    }).select().single()
    if (error) throw new Error(error.message)
    const saved = donationFromRow(data)
    setDonations((p) => [saved, ...p])
    return saved
  }, [supabase])

  const assign = useCallback(async (id: string, recipientId: string, volunteerId?: string) => {
    const status = volunteerId ? "driver_assigned" : "matched"
    const { error } = await supabase.from("donations").update({ recipient_id: recipientId, volunteer_id: volunteerId ?? null, status }).eq("id", id)
    if (error) throw new Error(error.message)
    setDonations((p) => p.map((d) => d.id === id ? { ...d, recipientId, volunteerId, status } : d))
    if (volunteerId) {
      await supabase.from("volunteers").update({ status: "on_pickup", current_assignment: id }).eq("id", volunteerId)
      setVolunteers((p) => p.map((v) => v.id === volunteerId ? { ...v, status: "on_pickup", currentAssignment: id } : v))
    }
  }, [supabase])

  const advance = useCallback(async (id: string) => {
    const current = donations.find((d) => d.id === id)
    if (!current) return
    const i = flow.indexOf(current.status)
    const status = flow[Math.min(i + 1, flow.length - 1)]
    const { error } = await supabase.from("donations").update({ status }).eq("id", id)
    if (error) throw new Error(error.message)
    setDonations((p) => p.map((d) => d.id === id ? { ...d, status } : d))
  }, [donations, supabase])

  const setVolunteerStatus = useCallback(async (id: string, status: VolunteerStatus) => {
    const { error } = await supabase.from("volunteers").update({ status }).eq("id", id)
    if (error) throw new Error(error.message)
    setVolunteers((p) => p.map((v) => v.id === id ? { ...v, status } : v))
  }, [supabase])

  const value = useMemo(() => ({ donations, recipients, volunteers, loading, addDonation, assign, advance, setVolunteerStatus }), [donations, recipients, volunteers, loading, addDonation, assign, advance, setVolunteerStatus])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const store = useContext(Ctx)
  if (!store) throw new Error("useStore must be used inside StoreProvider")
  return store
}

export { donationFromRow }
