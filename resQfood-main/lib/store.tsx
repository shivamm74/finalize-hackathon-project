"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { donations as d0, recipients as r0, volunteers as v0 } from "@/lib/mock-data"
import type { Donation, DonationStatus, Recipient, Volunteer, VolunteerStatus } from "@/types"

const flow: DonationStatus[] = ["matched", "driver_assigned", "pickup_in_progress", "delivered"]

interface Store {
  donations: Donation[]
  recipients: Recipient[]
  volunteers: Volunteer[]
  addDonation: (d: Donation) => void
  assign: (donationId: string, recipientId: string, volunteerId?: string) => void
  advance: (donationId: string) => void
  setVolunteerStatus: (id: string, s: VolunteerStatus) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [donations, setDonations] = useState(d0)
  const [recipients, setRecipients] = useState(r0)
  const [volunteers, setVolunteers] = useState(v0)

  const addDonation = useCallback((d: Donation) => setDonations((p) => [d, ...p]), [])
  const assign = useCallback((id: string, recipientId: string, volunteerId?: string) => {
    setDonations((p) => p.map((d) => d.id === id
      ? { ...d, recipientId, volunteerId, status: volunteerId ? "driver_assigned" : "matched" } : d))
    if (volunteerId) setVolunteers((p) => p.map((v) => v.id === volunteerId
      ? { ...v, status: "on_pickup", currentAssignment: id } : v))
  }, [])
  const advance = useCallback((id: string) => {
    setDonations((p) => p.map((d) => {
      if (d.id !== id) return d
      const i = flow.indexOf(d.status)
      return { ...d, status: flow[Math.min(i + 1, flow.length - 1)] }
    }))
  }, [])
  const setVolunteerStatus = useCallback((id: string, s: VolunteerStatus) =>
    setVolunteers((p) => p.map((v) => (v.id === id ? { ...v, status: s } : v))), [])

  const value = useMemo(() => ({ donations, recipients, volunteers, addDonation, assign, advance, setVolunteerStatus }),
    [donations, recipients, volunteers, addDonation, assign, advance, setVolunteerStatus])
  void setRecipients
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error("useStore must be used inside StoreProvider")
  return s
}
