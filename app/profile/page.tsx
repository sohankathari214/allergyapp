"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AppHeader from "@/components/app-header"

interface Allergen {
  id: number
  name: string
  severity: "mild" | "moderate" | "severe"
  comments: string
  dateAdded: string
}

export default function ProfilePage() {
  const [user, setUser] = useState({
    name: "Alex Johnson",
    username: "alexj",
    email: "alex@example.com",
    emergencyContact: "+1 (555) 123-4567",
    avatar: "",
  })

  const [allergens, setAllergens] = useState<Allergen[]>([
    {
      id: 1,
      name: "Peanuts",
      severity: "severe",
      comments: "Anaphylactic reaction - carry EpiPen at all times",
      dateAdded: "2023-01-15",
    },
    {
      id: 2,
      name: "Shellfish",
      severity: "moderate",
      comments: "Causes hives and difficulty breathing",
      dateAdded: "2023-02-20",
    },
    {
      id: 3,
      name: "Dairy",
      severity: "mild",
      comments: "Lactose intolerant - stomach discomfort",
      dateAdded: "2023-03-10",
    },
  ])

  const [isAddingAllergen, setIsAddingAllergen] = useState(false)
  const [newAllergen, setNewAllergen] = useState({
    name: "",
    severity: "mild" as "mild" | "moderate" | "severe",
    comments: "",
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-800 border-red-200"
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "mild":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const addAllergen = () => {
    if (newAllergen.name.trim()) {
      const allergen: Allergen = {
        id: Date.now(),
        name: newAllergen.name,
        severity: newAllergen.severity,
        comments: newAllergen.comments,
        dateAdded: new Date().toISOString().split("T")[0],
      }
      setAllergens([...allergens, allergen])
      setNewAllergen({ name: "", severity: "mild", comments: "" })
      setIsAddingAllergen(false)
    }
  }

  const removeAllergen = (id: number) => {
    setAllergens(allergens.filter((allergen) => allergen.id !== id))
  }

  return (
    <>
      <AppHeader
        title="Profile"
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
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
            Edit
          </Button>
        }
      />

      <div className="px-4 py-4 space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl">{user.name.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="text-center">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          <div className="flex gap-2 text-xs">
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {allergens.length} Known Allergens
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="allergens">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="allergens">Allergens</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="allergens" className="mt-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">My Allergens</h3>
              <Dialog open={isAddingAllergen} onOpenChange={setIsAddingAllergen}>
                <DialogTrigger asChild>
                  <Button size="sm">
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
                      <path d="M12 5v14"></path>
                      <path d="M5 12h14"></path>
                    </svg>
                    Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Allergen</DialogTitle>
                    <DialogDescription>Add a new allergen to your profile with severity and notes.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="allergen-name">Allergen Name</Label>
                      <Input
                        id="allergen-name"
                        placeholder="e.g., Peanuts, Shellfish, Dairy"
                        value={newAllergen.name}
                        onChange={(e) => setNewAllergen({ ...newAllergen, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="severity">Severity Level</Label>
                      <Select
                        value={newAllergen.severity}
                        onValueChange={(value: "mild" | "moderate" | "severe") =>
                          setNewAllergen({ ...newAllergen, severity: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mild">Mild - Minor discomfort</SelectItem>
                          <SelectItem value="moderate">Moderate - Noticeable symptoms</SelectItem>
                          <SelectItem value="severe">Severe - Life-threatening</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comments">Comments & Notes</Label>
                      <Textarea
                        id="comments"
                        placeholder="Describe your symptoms, triggers, or any additional notes..."
                        value={newAllergen.comments}
                        onChange={(e) => setNewAllergen({ ...newAllergen, comments: e.target.value })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingAllergen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addAllergen}>Add Allergen</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {allergens.map((allergen) => (
                <Card key={allergen.id}>
                  <CardHeader className="p-3 pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{allergen.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getSeverityColor(allergen.severity)}>{allergen.severity}</Badge>
                          <span className="text-xs text-muted-foreground">Added {allergen.dateAdded}</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeAllergen(allergen.id)}
                      >
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
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </Button>
                    </div>
                  </CardHeader>
                  {allergen.comments && (
                    <CardContent className="p-3 pt-0">
                      <p className="text-sm text-muted-foreground">{allergen.comments}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medical" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Medical Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input id="emergency-contact" defaultValue={user.emergencyContact} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="medical-notes">Additional Medical Notes</Label>
                  <Textarea
                    id="medical-notes"
                    placeholder="Any additional medical information, medications, or conditions..."
                  />
                </div>
                <Button>Save Medical Info</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">App Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allergen Warnings</p>
                    <p className="text-sm text-muted-foreground">Show warnings when allergens are detected</p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Scan Notifications</p>
                    <p className="text-sm text-muted-foreground">Get notified about scan results</p>
                  </div>
                  <Button variant="outline">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Emergency Contacts</p>
                    <p className="text-sm text-muted-foreground">Manage emergency contact information</p>
                  </div>
                  <Button variant="outline">Manage</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-red-600">Export Data</p>
                    <p className="text-sm text-muted-foreground">Export your allergen profile</p>
                  </div>
                  <Button variant="outline">Export</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
