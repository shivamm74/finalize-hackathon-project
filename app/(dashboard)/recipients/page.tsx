"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/shared/page-header"
import { useStore } from "@/lib/store"
import { recipientStatusLabels } from "@/lib/format"

export default function RecipientsPage() {
  const { recipients } = useStore()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Recipients" description="Shelters, NGOs and kitchens receiving food." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {recipients.map((r) => (
          <Card key={r.id}>
            <CardContent className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{r.name}</span>
                <Badge variant="secondary">{recipientStatusLabels[r.status]}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{r.address}</p>
              <Progress value={Math.round((r.currentLoad / r.capacity) * 100)} />
              <p className="text-xs text-muted-foreground">{r.currentLoad}/{r.capacity} meals · {r.mealsReceivedToday} today</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" render={<a href={`tel:${r.phone}`} />}>Call {r.contact}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
