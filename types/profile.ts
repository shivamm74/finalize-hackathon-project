export type UserRole = "operations" | "donor" | "shelter" | "volunteer"

export interface Profile {
  id: string
  email: string | null
  display_name: string
  role: UserRole
  organization_name: string | null
  phone: string | null
  avatar_initials: string | null
  created_at: string
  updated_at: string
}
