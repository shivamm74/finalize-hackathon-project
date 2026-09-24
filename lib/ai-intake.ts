import type { AIAnalysis } from "@/types"

const foodTerms = [
  "rice", "dal", "curry", "meal", "meals", "food", "lunch", "dinner", "breakfast",
  "bread", "sandwich", "salad", "soup", "vegetable", "veggie", "fruit", "produce",
  "milk", "yogurt", "pastry", "cake", "bread", "chicken", "meat", "pasta", "roti",
  "chapati", "sabzi", "biryani", "snack", "grocery", "beverage", "drink",
]

export function analyzeDonationText(raw: string): AIAnalysis {
  const normalized = raw.trim()
  if (normalized.length < 8) throw new Error("Please describe the food in more detail.")
  if (normalized.length > 500) throw new Error("Description must be 500 characters or fewer.")

  const text = normalized.toLowerCase()
  const words = text.match(/[a-z]{2,}/g) ?? []
  const hasFoodTerm = foodTerms.some((term) => text.includes(term))
  const looksLikeGibberish = words.length > 0 && words.every((word) => !/[aeiou]/.test(word))
  if (!hasFoodTerm || looksLikeGibberish) {
    throw new Error("Enter a valid food description, such as ‘45 meals of dal rice and vegetables’." )
  }

  const quantityMatch = text.match(/\b(\d+(?:\.\d+)?)\s*(meals?|trays?|portions?|boxes?|items?)\b/i)
  const estimatedMeals = quantityMatch ? Number(quantityMatch[1]) : 45
  const foodDetails = normalized
    .replace(/\b\d+(?:\.\d+)?\s*(meals?|trays?|portions?|boxes?|items?)\b/gi, "")
    .replace(/\b(prepared|pickup|pick up|from|today|yesterday|ago|vegetarian|vegan|halal|gluten[- ]free|non[- ]veg(?:etarian)?)\b/gi, "")
    .replace(/[,.()-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  const foodName = foodDetails || "Prepared food"

  if (!Number.isSafeInteger(estimatedMeals) || estimatedMeals < 1 || estimatedMeals > 1_000_000_000) {
    throw new Error("Enter a quantity between 1 and 1,000,000,000.")
  }

  const dietary = [] as AIAnalysis["dietary"]
  if (text.includes("vegan")) dietary.push("vegan")
  else if (text.includes("vegetarian")) dietary.push("vegetarian")
  if (text.includes("halal")) dietary.push("halal")
  if (text.includes("gluten")) dietary.push("gluten_free")
  if (text.includes("non-veg") || text.includes("chicken") || text.includes("meat")) {
    dietary.push("non_vegetarian")
  }
  const urgency: AIAnalysis["urgency"] =
    estimatedMeals >= 40 || text.includes("lunch") ? "high" : "medium"

  const safe = new Date(Date.now() + 102 * 60000)

  return {
    foodType: foodName,
    details: foodName,
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
