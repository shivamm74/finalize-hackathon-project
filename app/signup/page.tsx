import Link from "next/link"
import { Logo } from "@/components/shared/logo"
import { SignupForm } from "@/components/auth/auth-forms"

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <SignupForm />
      </main>
    </div>
  )
}
