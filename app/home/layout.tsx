import type { ReactNode } from "react"
import BottomNavigation from "@/components/bottom-navigation"
import DrawerNavigation from "@/components/drawer-navigation"

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background max-w-md mx-auto border-x border-gray-200">
      <main className="flex-1 pb-16">{children}</main>

      {/* Bottom Navigation for mobile */}
      <BottomNavigation />

      {/* Drawer Navigation - will be toggled from the header */}
      <DrawerNavigation />
    </div>
  )
}
