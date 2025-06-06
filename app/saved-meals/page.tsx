"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AppHeader from "@/components/app-header"

interface AllergenRisk {
  name: string
  likelihood: "high" | "medium" | "low"
  confidence: number
}

interface Meal {
  id: number
  name: string
  description: string
  allergenRisks: AllergenRisk[]
  tags: string[]
  image: string
  isSafe: boolean
  lastScanned: string
}

export default function SavedMealsPage() {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      name: "Avocado Toast",
      description: "Whole grain toast with smashed avocado, cherry tomatoes, and a poached egg",
      allergenRisks: [
        { name: "Gluten", likelihood: "high", confidence: 95 },
        { name: "Eggs", likelihood: "high", confidence: 90 },
        { name: "Sesame", likelihood: "low", confidence: 15 },
      ],
      tags: ["breakfast", "vegetarian"],
      image: "/placeholder.svg?height=150&width=300",
      isSafe: true,
      lastScanned: "2 days ago",
    },
    {
      id: 2,
      name: "Thai Curry Bowl",
      description: "Coconut curry with vegetables and rice, garnished with peanuts",
      allergenRisks: [
        { name: "Peanuts", likelihood: "high", confidence: 98 },
        { name: "Shellfish", likelihood: "medium", confidence: 45 },
        { name: "Soy", likelihood: "medium", confidence: 60 },
      ],
      tags: ["dinner", "spicy", "asian"],
      image: "/placeholder.svg?height=150&width=300",
      isSafe: false,
      lastScanned: "1 week ago",
    },
    {
      id: 3,
      name: "Greek Salad",
      description: "Fresh vegetables with feta cheese, olives, and olive oil dressing",
      allergenRisks: [
        { name: "Dairy", likelihood: "high", confidence: 92 },
        { name: "Sulfites", likelihood: "low", confidence: 25 },
      ],
      tags: ["lunch", "mediterranean", "vegetarian"],
      image: "/placeholder.svg?height=150&width=300",
      isSafe: false,
      lastScanned: "3 days ago",
    },
  ])

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getSafetyBadge = (isSafe: boolean) => {
    return isSafe ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
        Safe for you
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 border-red-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <path d="M12 7v5"></path>
          <path d="M12 16h.01"></path>
        </svg>
        Contains allergens
      </Badge>
    )
  }

  return (
    <>
      <AppHeader
        title="Saved Meals"
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
              <path d="M3 6h18l-2 13H5L3 6Z"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Scan New
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Meals</TabsTrigger>
            <TabsTrigger value="safe">Safe for Me</TabsTrigger>
            <TabsTrigger value="warnings">Has Warnings</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          {meals.map((meal) => (
            <Card key={meal.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img src={meal.image || "/placeholder.svg"} alt={meal.name} className="object-cover w-full h-full" />
                <div className="absolute top-2 right-2">{getSafetyBadge(meal.isSafe)}</div>
              </div>

              <CardHeader className="p-3 pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{meal.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{meal.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Last scanned {meal.lastScanned}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-3 pt-2">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {meal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Allergen Risk Assessment</h4>
                    <div className="space-y-2">
                      {meal.allergenRisks.map((risk, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{risk.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge className={getLikelihoodColor(risk.likelihood)} variant="outline">
                              {risk.likelihood} ({risk.confidence}%)
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-3 pt-0 flex justify-between">
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
                    <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path>
                    <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path>
                    <path d="m14 16-3 3 3 3"></path>
                    <path d="M8.293 13.596 7.196 9.5 3.1 10.598"></path>
                    <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"></path>
                    <path d="m13.378 9.633 4.096 1.098 1.097-4.096"></path>
                  </svg>
                  Re-scan
                </Button>
                <Button size="sm" variant={meal.isSafe ? "default" : "destructive"}>
                  {meal.isSafe ? (
                    <>
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
                      Save Recipe
                    </>
                  ) : (
                    <>
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
                        <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path>
                      </svg>
                      View Warnings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
