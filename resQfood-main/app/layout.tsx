import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "FoodFlow — Real-Time Food Rescue & Redistribution",
    template: "%s · FoodFlow",
  },
  description:
    "FoodFlow connects surplus food from restaurants and cafeterias with nearby shelters and volunteers in real time — matching donations by capacity, food type, urgency and distance.",
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
