"use server"

import { createClient } from "@/lib/supabase/server"
import type { Donation } from "@/types"

export async function createDonationAction(donation: Donation) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Your login session is not available on the server. Please sign in again." }
  }

  const { data, error } = await supabase.from("donations").insert({
    code: donation.code,
    created_by: user.id,
    donor_name: donation.donor.name,
    donor_type: donation.donor.type,
    donor_address: donation.donor.address,
    food_name: donation.foodName,
    category: donation.category,
    quantity: donation.quantity,
    unit: donation.unit,
    dietary: donation.dietary,
    prepared_at: donation.preparedAt,
    safe_until: donation.safeUntil,
    description: donation.description,
    handling_notes: donation.handlingNotes,
    status: donation.status,
    urgency: donation.urgency,
    distance_km: donation.distanceKm,
    recipient_id: donation.recipientId ?? null,
    volunteer_id: donation.volunteerId ?? null,
    match_score: donation.matchScore ?? null,
    map_x: donation.location.x,
    map_y: donation.location.y,
  }).select().single()

  if (error) return { error: error.message }
  return { donation: data as Donation }
}
