"use client"

import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { useStore } from "@/lib/store"
import { vehicleLabels, volunteerStatusLabels } from "@/lib/format"

export default function VolunteersPage() {
  const { volunteers, setVolunteerStatus } = useStore()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Volunteers" description="Drivers and riders on the network." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {volunteers.map((v) => (
          <Card key={v.id}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <span className="font-medium">{v.name}</span>
                <Badge variant={v.status === "available" ? "default" : "secondary"}>{volunteerStatusLabels[v.status]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{vehicleLabels[v.vehicle]} · {v.completedPickups} pickups · ★ {v.rating}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { const s = v.status === "offline" ? "available" : "offline"; setVolunteerStatus(v.id, s); toast.success(`${v.name} is now ${volunteerStatusLabels[s].toLowerCase()}`) }}>
                  {v.status === "offline" ? "Set available" : "Set offline"}
                </Button>
                <Button size="sm" variant="ghost" render={<a href={`tel:${v.phone}`} />}>Call</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
