import { PageHeader } from "@/components/shared/page-header"
import { ProfileForm } from "@/components/auth/profile-form"
import { getCurrentProfile } from "@/lib/auth/session"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect("/login")

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage your account, organization, and how FoodFlow uses your profile."
      />
      <ProfileForm profile={profile} />
    </div>
  )
}
