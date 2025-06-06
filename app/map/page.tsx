"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AppHeader from "@/components/app-header"

interface Location {
  id: number
  name: string
  type: string
  address: string
  rating: number
  distance: string
}

export default function MapPage() {
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: "Central Park",
      type: "Park",
      address: "Manhattan, NY 10022",
      rating: 4.8,
      distance: "0.5 miles",
    },
    {
      id: 2,
      name: "The Coffee House",
      type: "Cafe",
      address: "123 Main St",
      rating: 4.5,
      distance: "0.8 miles",
    },
    {
      id: 3,
      name: "City Museum",
      type: "Museum",
      address: "456 Art Avenue",
      rating: 4.7,
      distance: "1.2 miles",
    },
  ])

  return (
    <>
      <AppHeader
        title="Map"
        action={
          <Button size="sm" variant="outline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            My Location
          </Button>
        }
      />

      <div className="relative">
        {/* Map container */}
        <div className="h-[30vh] bg-gray-200 flex items-center justify-center">
          <div className="text-center">
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
              className="mx-auto mb-2 text-gray-400"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
              <line x1="9" x2="9" y1="3" y2="18"></line>
              <line x1="15" x2="15" y1="6" y2="21"></line>
            </svg>
            <p className="text-sm text-gray-500">Map view</p>
          </div>
        </div>

        {/* Map controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button size="icon" variant="outline" className="h-8 w-8 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
          </Button>
          <Button size="icon" variant="outline" className="h-8 w-8 bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
            </svg>
          </Button>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        <div className="flex items-center space-x-2">
          <Input placeholder="Search locations..." className="flex-1" />
          <Button size="icon" variant="ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </svg>
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="visited">Visited</TabsTrigger>
            <TabsTrigger value="nearby">Nearby</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {locations.map((location) => (
            <Card key={location.id} className="cursor-pointer hover:bg-gray-50 transition-colors">
              <CardHeader className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{location.name}</CardTitle>
                    <CardDescription>
                      {location.type} • {location.distance}
                    </CardDescription>
                  </div>
                  <div className="flex items-center bg-primary/10 text-primary rounded px-2 py-1 text-xs">
                    {location.rating}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-0.5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{location.address}</p>
              </CardHeader>
              <CardContent className="p-3 pt-0 flex gap-2">
                <Button variant="outline" size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M9 18l6-6-6-6"></path>
                  </svg>
                  Directions
                </Button>
                <Button variant="outline" size="sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-1"
                  >
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Save
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
