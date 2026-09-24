import Link from "next/link"
import { Utensils, Package, Truck, AlertTriangle, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MealsChart } from "@/components/dashboard/meals-chart"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { SimulatedMap, MapLegend } from "@/components/shared/simulated-map"
import { StatusBadge } from "@/components/shared/status-badge"
import { UrgencyBadge } from "@/components/shared/meta-badges"
import { Countdown } from "@/components/shared/countdown"
import { buildNetworkMarkers } from "@/lib/map"
import {
  kpis,
  donations,
  analytics,
  activityFeed,
} from "@/lib/mock-data"
import { formatNumber } from "@/lib/format"

export default function DashboardPage() {
  const atRisk = donations.filter(
    (d) => d.status === "at_risk" || d.status === "needs_match",
  )
  const markers = buildNetworkMarkers()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Operations dashboard"
        description="Live view of surplus food moving across your city — from posting to delivery."
        actions={
          <Button render={<Link href="/donations/new" />}>New donation</Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Meals rescued today"
          value={formatNumber(kpis.mealsRescuedToday)}
          icon={Utensils}
          trend={`${kpis.mealsRescuedTrend}%`}
          trendPositive
          sub="vs. yesterday"
        />
        <StatCard
          label="Active donations"
          value={String(kpis.activeDonations)}
          icon={Package}
          trend={`+${kpis.activeDonationsTrend}`}
          sub="awaiting delivery"
        />
        <StatCard
          label="Pickups in progress"
          value={String(kpis.pickupsInProgress)}
          icon={Truck}
          trend={`+${kpis.pickupsTrend}`}
          sub="drivers en route"
        />
        <StatCard
          label="Food at risk"
          value={String(kpis.foodAtRisk)}
          icon={AlertTriangle}
          trend={String(kpis.foodAtRiskTrend)}
          trendPositive={false}
          sub="needs action soon"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Meals rescued</CardTitle>
              <CardDescription>Last 6 weeks</CardDescription>
            </div>
            <Badge variant="secondary">
              {formatNumber(analytics.mealsRescued)} all-time
            </Badge>
          </CardHeader>
          <CardContent>
            <MealsChart data={analytics.mealsOverTime} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Automated matching & dispatch</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityFeed events={activityFeed} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Live network</CardTitle>
              <CardDescription>
                Donations, recipients and volunteers in real time
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" render={<Link href="/map" />}>
              Full map
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <SimulatedMap markers={markers} />
            <MapLegend />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <CardTitle>Needs attention</CardTitle>
              <CardDescription>At-risk & unmatched</CardDescription>
            </div>
            <Badge variant="destructive">{atRisk.length}</Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {atRisk.map((d) => (
              <Link
                key={d.id}
                href={`/donations/${d.code}`}
                className="flex flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{d.foodName}</span>
                  <UrgencyBadge urgency={d.urgency} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={d.status} />
                  <Countdown safeUntil={d.safeUntil} />
                </div>
              </Link>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="justify-start"
              render={<Link href="/donations?status=needs_match" />}
            >
              View all donations
              <ArrowRight data-icon="inline-end" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
