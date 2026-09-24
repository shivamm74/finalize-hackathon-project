"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { DietaryBadges, UrgencyBadge } from "@/components/shared/meta-badges"
import { analyzeDonationText } from "@/lib/ai-intake"
import { donations as seed } from "@/lib/mock-data"
import { useStore } from "@/lib/store"
import type { AIAnalysis, Donation } from "@/types"

const sample = "45 vegetarian lunch meals, dal rice and sabzi, prepared 1 hour ago, halal, pickup from Hotel Rajdhani"

export default function NewDonationPage() {
  const router = useRouter()
  const { addDonation } = useStore()
  const [text, setText] = useState("")
  const [result, setResult] = useState<AIAnalysis | null>(null)

  function analyze() {
    if (!text.trim()) return toast.error("Describe the food first.")
    try {
      setResult(analyzeDonationText(text))
    } catch (error) {
      setResult(null)
      toast.error(error instanceof Error ? error.message : "Enter a valid food description.")
    }
  }

  async function post() {
    if (!result) return
    const base = seed[0]
    const n = 1050 + Math.floor(Math.random() * 900)
    const d: Donation = {
      ...base,
      id: `FD-${n}`, code: `FD-${n}`,
      foodName: result.foodType, category: result.category, quantity: result.estimatedMeals,
      unit: "meals", dietary: result.dietary, urgency: result.urgency,
      safeUntil: result.safeUntil, preparedAt: new Date().toISOString(), createdAt: new Date().toISOString(),
      status: "needs_match", recipientId: undefined, volunteerId: undefined, matchScore: undefined,
      description: text,
    }
    try {
      const saved = await addDonation(d)
      toast.success(`${saved.code} posted and saved`)
      router.push(`/donations/${saved.id}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save donation")
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <PageHeader title="New donation" description="Describe the surplus food in plain words. We extract the details." />
      <Card>
        <CardContent className="flex flex-col gap-3 p-5">
          <Textarea
            rows={5}
            value={text}
            maxLength={500}
            onChange={(e) => setText(e.target.value)}
            placeholder={sample}
            aria-describedby="donation-description-help"
          />
          <p id="donation-description-help" className="text-xs text-muted-foreground">
            Describe the food, quantity, and pickup details. {text.length}/500 characters.
          </p>
          <div className="flex gap-2">
            <Button onClick={analyze}><Sparkles data-icon="inline-start" />Analyze</Button>
            <Button variant="outline" onClick={() => setText(sample)}>Use sample</Button>
          </div>
        </CardContent>
      </Card>
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{result.estimatedMeals} {result.estimatedMeals === 1 ? "meal" : "meals"} · {result.foodType}</CardTitle>
            <CardDescription>
              Detected food: {result.details ?? result.foodType} · Confidence {Math.round(result.confidence * 100)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <UrgencyBadge urgency={result.urgency} />
              <DietaryBadges dietary={result.dietary} />
            </div>
            <ul className="list-disc pl-5 text-sm text-muted-foreground">
              {result.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
            <Button className="self-start" onClick={post}>Post donation</Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
