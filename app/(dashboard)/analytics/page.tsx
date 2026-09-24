import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { StatCard } from "@/components/shared/stat-card"
import { MealsChart } from "@/components/dashboard/meals-chart"
import { analytics } from "@/lib/mock-data"
import { formatNumber } from "@/lib/format"
import { Utensils, Leaf, Truck, Timer } from "lucide-react"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Analytics" description="Impact and efficiency across the network." />
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Meals rescued" value={formatNumber(analytics.mealsRescued)} icon={Utensils} />
        <StatCard label="CO₂ avoided" value={`${analytics.co2AvoidedTonnes} t`} icon={Leaf} />
        <StatCard label="Deliveries" value={formatNumber(analytics.successfulDeliveries)} icon={Truck} />
        <StatCard label="Avg match time" value={`${analytics.avgMatchingMinutes} min`} icon={Timer} />
      </div>
      <Card>
        <CardHeader><CardTitle>Meals over time</CardTitle><CardDescription>Last 6 weeks</CardDescription></CardHeader>
        <CardContent><MealsChart data={analytics.mealsOverTime} /></CardContent>
      </Card>
    </div>
  )
}
