import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"
import { StoreProvider } from "@/lib/store"
import { AppShell } from "@/components/layout/app-shell"
import { getCurrentProfile } from "@/lib/auth/session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile()
  if (!profile) redirect("/login")

  return <StoreProvider>
      <AppShell profile={profile}>{children}</AppShell>
    </StoreProvider>
}
