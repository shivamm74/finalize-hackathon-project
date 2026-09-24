import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Route,
  ShieldCheck,
  Clock,
  Utensils,
  Home,
  Bike,
  BarChart3,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LandingHeader } from "@/components/landing/landing-header"
import { LandingFooter } from "@/components/landing/landing-footer"
import { SimulatedMap, MapLegend } from "@/components/shared/simulated-map"
import type { MapMarker } from "@/components/shared/simulated-map"
import { landingStats } from "@/lib/mock-data"

const heroMarkers: MapMarker[] = [
  { id: "1", x: 30, y: 30, label: "Saffron Kitchen — 45 meals", kind: "donation" },
  { id: "2", x: 58, y: 22, label: "Rise & Crumb — 80 items", kind: "donation" },
  { id: "3", x: 20, y: 60, label: "Greenleaf — at risk", kind: "donation", atRisk: true },
  { id: "4", x: 70, y: 40, label: "Hope Shelter", kind: "recipient" },
  { id: "5", x: 46, y: 68, label: "St. Anne's Food Bank", kind: "recipient" },
  { id: "6", x: 48, y: 44, label: "Sofia — en route", kind: "volunteer", active: true },
]

const steps = [
  {
    icon: Utensils,
    title: "Donation posted",
    body: "Restaurants and cafeterias list surplus food in seconds.",
  },
  {
    icon: Sparkles,
    title: "AI analysis",
    body: "We estimate meals, dietary type, urgency, and the safe-until window.",
  },
  {
    icon: Route,
    title: "Best recipient match",
    body: "Capacity, distance, and food compatibility produce a transparent score.",
  },
]

const features = [
  {
    icon: Sparkles,
    title: "AI food analysis",
    body: "Automatic meal estimates, dietary tags, urgency scoring and freshness windows from a single photo.",
  },
  {
    icon: MapPin,
    title: "Smart matching",
    body: "Distance, capacity, dietary fit and pickup windows combine into a transparent match score.",
  },
  {
    icon: Clock,
    title: "Freshness clock",
    body: "Every donation carries a live safe-to-eat countdown so nothing expires waiting for a match.",
  },
  {
    icon: Bike,
    title: "Volunteer routing",
    body: "Assign the nearest driver, share live ETAs and confirm delivery with proof of handoff.",
  },
  {
    icon: BarChart3,
    title: "Impact analytics",
    body: "Track meals rescued, food diverted and CO₂ avoided across your whole network.",
  },
  {
    icon: ShieldCheck,
    title: "Safe by design",
    body: "Handling notes, temperature guidance and audit trails keep every handoff accountable.",
  },
]

const audiences = [
  {
    icon: Utensils,
    tag: "For donors",
    title: "Turn surplus into impact",
    body: "Stop throwing away good food. Post it in seconds and watch it reach a shelter within the hour.",
  },
  {
    icon: Home,
    tag: "For recipients",
    title: "Reliable meals on demand",
    body: "Receive food matched to your dietary needs and capacity, with delivery you can count on.",
  },
  {
    icon: Bike,
    tag: "For volunteers",
    title: "Give an hour, feed dozens",
    body: "Pick up nearby routes that fit your schedule and see the difference every trip makes.",
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-muted),transparent_70%)]" />
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
            <div className="flex flex-col gap-6">
              <Badge variant="secondary" className="w-fit gap-1.5">
                <span className="size-1.5 rounded-full bg-brand" />
                Rescuing 842 meals today
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Rescue surplus food.
                <br />
                Before it becomes waste.
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground text-pretty">
                FoodFlow connects surplus food from restaurants and cafeterias
                with nearby shelters and volunteers in real time — matching by
                capacity, food type, urgency, and distance.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" render={<Link href="/donations/new" />}>
                  Post a Donation
                  <ArrowRight data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<Link href="/dashboard" />}
                >
                  View Live Operations
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-2">
                {landingStats.slice(0, 3).map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span className="text-2xl font-semibold tabular-nums">
                      {s.value}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden shadow-lg">
              <CardContent className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Live network</span>
                  <Badge variant="outline" className="gap-1.5">
                    <span className="size-1.5 animate-pulse rounded-full bg-brand" />
                    Real-time
                  </Badge>
                </div>
                <SimulatedMap markers={heroMarkers} className="aspect-[16/11]" />
                <MapLegend />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="border-t bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="flex flex-col gap-3 text-center">
              <span className="text-sm font-medium text-brand">How it works</span>
              <h2 className="text-3xl font-semibold tracking-tight text-balance">
                From surplus to served in three steps
              </h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <Card key={s.title} className="relative">
                  <CardContent className="flex flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                        <s.icon className="size-5" />
                      </span>
                      <span className="text-4xl font-semibold text-muted-foreground/20 tabular-nums">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {s.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform / features */}
        <section id="platform">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="flex max-w-2xl flex-col gap-3">
              <span className="text-sm font-medium text-brand">The platform</span>
              <h2 className="text-3xl font-semibold tracking-tight text-balance">
                Everything you need to move food fast
              </h2>
              <p className="text-muted-foreground text-pretty">
                A coordination layer purpose-built for perishable donations,
                where every minute counts.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="flex flex-col gap-3 rounded-xl border bg-card p-6"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact band */}
        <section id="impact" className="border-y bg-foreground text-background">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            {landingStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-3xl font-semibold tracking-tight tabular-nums lg:text-4xl">
                  {s.value}
                </span>
                <span className="text-sm text-background/70">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Audiences */}
        <section id="partners">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="grid gap-6 md:grid-cols-3">
              {audiences.map((a) => (
                <Card key={a.tag}>
                  <CardContent className="flex flex-col gap-4 p-6">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <a.icon className="size-5" />
                    </span>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-medium uppercase tracking-wide text-brand">
                        {a.tag}
                      </span>
                      <h3 className="text-lg font-semibold">{a.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {a.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-20 sm:px-6">
          <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border bg-brand px-6 py-14 text-center text-brand-foreground sm:py-20">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Join the network rescuing meals every day
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-foreground/85 text-pretty">
              Whether you have food to give, mouths to feed, or an hour to
              drive — there&apos;s a place for you in FoodFlow.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                variant="secondary"
                render={<Link href="/donations/new" />}
              >
                Donate food
                <ArrowRight data-icon="inline-end" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/dashboard" />}
                className="border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
              >
                Open dashboard
              </Button>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
