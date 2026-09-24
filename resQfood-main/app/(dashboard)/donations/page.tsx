"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { DonationsExplorer } from "@/components/donations/donations-explorer"
import { useStore } from "@/lib/store"

export default function DonationsPage() {
  const { donations } = useStore()
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Donations"
        description="Every surplus food listing, from posting to delivery."
        actions={<Button render={<Link href="/donations/new" />}>New donation</Button>}
      />
      <DonationsExplorer donations={donations} />
    </div>
  )
}
