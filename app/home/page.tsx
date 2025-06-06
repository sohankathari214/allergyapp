"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AppHeader from "@/components/app-header"
import Link from "next/link"

export default function HomePage() {
  const [userAllergens] = useState([
    { name: "Peanuts", severity: "severe" },
    { name: "Shellfish", severity: "moderate" },
    { name: "Dairy", severity: "mild" },
  ])

  const [recentScans] = useState([
    { name: "Greek Yogurt", status: "safe", time: "2 hours ago" },
    { name: "Thai Curry", status: "warning", time: "Yesterday" },
    { name: "Avocado Toast", status: "safe", time: "2 days ago" },
  ])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-error text-error border-error"
      case "moderate":
        return "bg-orange-50 text-orange-700 border-orange-200"
      case "mild":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      default:
        return "bg-secondary text-secondary-foreground border-secondary"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "safe" ? "bg-success text-success border-success" : "bg-error text-error border-error"
  }

  return (
    <>
      <AppHeader title="AllergyGuard" />

      <div className="px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold">Welcome back, Alex</h1>
          <p className="text-muted-foreground text-base">Stay safe with your allergen monitoring</p>
        </div>

        {/* Quick Scan Button */}
        <Link href="/scan">
          <Card className="bg-gradient-primary border-primary cursor-pointer hover:bg-primary/90 transition-colors">
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto text-primary-600"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                <div className="space-y-1">
                  <p className="font-semibold text-primary-700 text-lg">Scan Food for Allergens</p>
                  <p className="text-sm text-primary-600">Tap to start scanning</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Your Allergens */}
        <Card className="border-accent">
          <CardHeader className="pb-4 bg-gradient-accent">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Your Allergens</CardTitle>
              <Link href="/profile">
                <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                  Manage
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {userAllergens.map((allergen, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="font-medium text-base">{allergen.name}</span>
                <Badge className={`${getSeverityColor(allergen.severity)} px-3 py-1`}>{allergen.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card className="border-accent">
          <CardHeader className="pb-4 bg-gradient-accent">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Recent Scans</CardTitle>
              <Link href="/scan-history">
                <Button variant="ghost" size="sm" className="hover:bg-accent/50">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {recentScans.map((scan, index) => (
              <div key={index} className="flex justify-between items-center py-3">
                <div className="space-y-1">
                  <p className="font-medium text-base">{scan.name}</p>
                  <p className="text-sm text-muted-foreground">{scan.time}</p>
                </div>
                <Badge className={`${getStatusColor(scan.status)} px-3 py-1`}>
                  {scan.status === "safe" ? "Safe" : "Warning"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/scan-history">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-accent">
              <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent-500"
                >
                  <path d="M3 3v5h5"></path>
                  <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path>
                  <path d="M12 7v5l4 2"></path>
                </svg>
                <p className="text-sm font-medium">Scan History</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors border-accent">
              <CardContent className="flex flex-col items-center text-center p-6 space-y-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-accent-500"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M12 7v5"></path>
                  <path d="M12 16h.01"></path>
                </svg>
                <p className="text-sm font-medium">Allergen Profile</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </>
  )
}
