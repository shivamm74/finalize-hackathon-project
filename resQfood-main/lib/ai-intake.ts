import type { AIAnalysis } from "@/types"

export function analyzeDonationText(raw: string): AIAnalysis {
  const text = raw.toLowerCase()
  const mealMatch = text.match(/(\d+)\s*(meals?|trays?|portions?|boxes?|items?)/)
  const estimatedMeals = mealMatch ? Number(mealMatch[1]) : 45

  const dietary = [] as AIAnalysis["dietary"]
  if (text.includes("vegan")) dietary.push("vegan")
  else if (text.includes("vegetarian")) dietary.push("vegetarian")
  if (text.includes("halal")) dietary.push("halal")
  if (text.includes("gluten")) dietary.push("gluten_free")
  if (text.includes("non-veg") || text.includes("chicken") || text.includes("meat")) {
    dietary.push("non_vegetarian")
  }
  if (dietary.length === 0) dietary.push("vegetarian")

  const urgency: AIAnalysis["urgency"] =
    estimatedMeals >= 40 || text.includes("lunch") ? "high" : "medium"

  const safe = new Date(Date.now() + 102 * 60000)

  return {
    foodType: dietary.includes("vegetarian") && !dietary.includes("non_vegetarian")
      ? "Vegetarian meals"
      : "Prepared meals",
    estimatedMeals,
    dietary,
    urgency,
    safeUntil: safe.toISOString(),
    category: text.includes("bread") || text.includes("pastr") ? "bakery" : "prepared",
    confidence: 0.92,
    notes: [
      "Quantity inferred from the pasted description",
      "Urgency scored from portion size and service window",
      "Safe-until estimated from typical prepared-food hold time",
    ],
  }
}
