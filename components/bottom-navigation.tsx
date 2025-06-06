"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function BottomNavigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t border-accent max-w-md mx-auto">
      <div className="grid grid-cols-5 h-16 relative">
        <Link
          href="/home"
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            isActive("/home") ? "text-primary-600" : "text-muted-foreground",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-xs">Home</span>
        </Link>

        <Link
          href="/forum"
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            isActive("/forum") ? "text-primary-600" : "text-muted-foreground",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span className="text-xs">Forum</span>
        </Link>

        {/* Camera Button (Center) */}
        <div className="relative flex justify-center">
          <Link href="/scan" className="absolute -top-5">
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-gradient-primary hover:bg-primary/90 text-primary-600 shadow-lg border-2 border-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
                <path d="m14 16-3 3 3 3"></path>
                <path d="M8.293 13.596 7.196 9.5 3.1 10.598"></path>
                <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"></path>
                <path d="m13.378 9.633 4.096 1.098 1.097-4.096"></path>
              </svg>
            </Button>
          </Link>
        </div>

        <Link
          href="/scan-history"
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            isActive("/scan-history") ? "text-primary-600" : "text-muted-foreground",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v5h5"></path>
            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
            <path d="M12 7v5l4 2"></path>
          </svg>
          <span className="text-xs">History</span>
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex flex-col items-center justify-center gap-1",
            isActive("/profile") ? "text-primary-600" : "text-muted-foreground",
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  )
}
