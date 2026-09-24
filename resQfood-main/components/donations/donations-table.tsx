import Link from "next/link"
import { ChevronRight } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/shared/status-badge"
import { DietaryBadges } from "@/components/shared/meta-badges"
import { Countdown } from "@/components/shared/countdown"
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { categoryLabels } from "@/lib/format"
import type { Donation } from "@/types"

export function DonationsTable({ donations }: { donations: Donation[] }) {
  if (donations.length === 0) {
    return (
      <Empty className="border">
        <EmptyHeader>
          <EmptyTitle>No donations found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or post a new donation.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="pl-4">Donation</TableHead>
            <TableHead className="hidden md:table-cell">Quantity</TableHead>
            <TableHead className="hidden lg:table-cell">Dietary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Fresh for</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {donations.map((d) => (
            <TableRow key={d.id} className="group">
              <TableCell className="pl-4">
                <Link
                  href={`/donations/${d.code}`}
                  className="flex flex-col gap-0.5 outline-none"
                >
                  <span className="font-medium">{d.foodName}</span>
                  <span className="text-xs text-muted-foreground">
                    {d.code} · {d.donor.name}
                  </span>
                </Link>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="text-sm">
                  {d.quantity} {d.unit}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {categoryLabels[d.category]}
                </span>
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <DietaryBadges dietary={d.dietary} />
              </TableCell>
              <TableCell>
                <StatusBadge status={d.status} />
              </TableCell>
              <TableCell>
                <Countdown safeUntil={d.safeUntil} />
              </TableCell>
              <TableCell>
                <Link
                  href={`/donations/${d.code}`}
                  className="flex items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground"
                  aria-label={`View ${d.code}`}
                >
                  <ChevronRight className="size-4" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
