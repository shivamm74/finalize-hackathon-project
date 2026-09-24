import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { Donation } from "@/types"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const authorization = request.headers.get("authorization")
    const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
    const { data: { user }, error: authError } = accessToken
      ? await supabase.auth.getUser(accessToken)
      : await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Your login session is not available. Please sign in again." }, { status: 401 })
    }

    const donation = (await request.json()) as Donation
    if (!donation?.code || !donation.foodName || !Number.isFinite(donation.quantity) || donation.quantity < 1) {
      return NextResponse.json({ error: "Please provide valid donation details." }, { status: 400 })
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

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ donation: data })
  } catch (error) {
    console.error("[v0] Donation API failed:", error)
    return NextResponse.json({ error: "Could not save donation. Please try again." }, { status: 500 })
  }
}
