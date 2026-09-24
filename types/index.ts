export type DonationStatus =
  | "needs_match"
  | "matched"
  | "driver_assigned"
  | "pickup_in_progress"
  | "delivered"
  | "at_risk"

export type FoodCategory =
  | "prepared"
  | "produce"
  | "bakery"
  | "dairy"
  | "packaged"
  | "beverages"

export type DietaryType =
  | "vegetarian"
  | "vegan"
  | "non_vegetarian"
  | "halal"
  | "gluten_free"

export type Urgency = "low" | "medium" | "high" | "critical"

export type VolunteerStatus = "available" | "on_pickup" | "offline"

export type RecipientStatus = "accepting" | "near_capacity" | "full" | "closed"

export type VehicleType = "car" | "bike" | "scooter" | "van" | "on_foot"

export interface GeoPoint {
  /** Normalized 0-100 coordinates for the simulated map */
  x: number
  y: number
  label: string
}

export interface Donor {
  id: string
  name: string
  type: "restaurant" | "cafeteria" | "grocer" | "bakery" | "catering"
  address: string
}

export interface Donation {
  id: string
  code: string
  donor: Donor
  foodName: string
  category: FoodCategory
  quantity: number
  unit: string
  dietary: DietaryType[]
  preparedAt: string
  safeUntil: string
  description?: string
  handlingNotes?: string
  status: DonationStatus
  urgency: Urgency
  distanceKm?: number
  recipientId?: string
  volunteerId?: string
  matchScore?: number
  createdAt: string
  location: GeoPoint
}

export interface Recipient {
  id: string
  name: string
  type: "shelter" | "ngo" | "food_bank" | "community_kitchen"
  address: string
  capacity: number
  currentLoad: number
  preferences: DietaryType[]
  status: RecipientStatus
  lastDeliveryAt?: string
  mealsReceivedToday: number
  location: GeoPoint
  contact: string
  phone: string
}

export interface Volunteer {
  id: string
  name: string
  status: VolunteerStatus
  vehicle: VehicleType
  distanceKm: number
  completedPickups: number
  rating: number
  etaMinutes?: number
  currentAssignment?: string
  location: GeoPoint
  phone: string
  joinedAt: string
  avatarColor: string
}

export interface MatchReason {
  label: string
  satisfied: boolean
}

export interface Match {
  id: string
  donationId: string
  recipientId: string
  distanceKm: number
  score: number
  capacityFit: number
  dietaryCompatible: boolean
  windowCompatible: boolean
  suggestedVolunteerId?: string
  reasons: MatchReason[]
}

export interface AIAnalysis {
  foodType: string
  estimatedMeals: number
  dietary: DietaryType[]
  urgency: Urgency
  safeUntil: string
  category: FoodCategory
  confidence: number
  notes: string[]
}

export interface ActivityEvent {
  id: string
  time: string
  label: string
  type: "posted" | "analyzed" | "matched" | "assigned" | "pickup" | "delivered"
}

export interface TimeSeriesPoint {
  date: string
  meals: number
  deliveries: number
}

export interface CategoryDatum {
  category: string
  meals: number
}

export interface LocationDatum {
  location: string
  meals: number
}

export type AssignmentStatus = "assigned" | "en_route" | "picked_up" | "delivered"

export interface Assignment {
  id: string
  donationId: string
  volunteerId: string
  etaMinutes: number
  status: AssignmentStatus
}

export interface AnalyticsData {
  mealsRescued: number
  foodDivertedTonnes: number
  co2AvoidedTonnes: number
  successfulDeliveries: number
  mealsOverTime: TimeSeriesPoint[]
  byCategory: CategoryDatum[]
  byLocation: LocationDatum[]
  avgMatchingMinutes: number
  avgPickupMinutes: number
  deliverySuccessRate: number
  rescueEfficiency: number
}
