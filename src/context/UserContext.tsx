"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Allergen {
  id: number
  name: string
  severity: "mild" | "moderate" | "severe"
  comments: string
  dateAdded: string
}

interface UserContextType {
  allergens: Allergen[]
  addAllergen: (allergen: Omit<Allergen, "id" | "dateAdded">) => void
  removeAllergen: (id: number) => void
  updateAllergen: (id: number, allergen: Partial<Allergen>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  useEffect(() => {
    loadAllergens()
  }, [])

  const loadAllergens = async () => {
    try {
      const stored = await AsyncStorage.getItem("user-allergens")
      if (stored) {
        setAllergens(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading allergens:", error)
    }
  }

  const saveAllergens = async (newAllergens: Allergen[]) => {
    try {
      await AsyncStorage.setItem("user-allergens", JSON.stringify(newAllergens))
      setAllergens(newAllergens)
    } catch (error) {
      console.error("Error saving allergens:", error)
    }
  }

  const addAllergen = (allergen: Omit<Allergen, "id" | "dateAdded">) => {
    const newAllergen: Allergen = {
      ...allergen,
      id: Date.now(),
      dateAdded: new Date().toISOString().split("T")[0],
    }
    const newAllergens = [...allergens, newAllergen]
    saveAllergens(newAllergens)
  }

  const removeAllergen = (id: number) => {
    const newAllergens = allergens.filter((a) => a.id !== id)
    saveAllergens(newAllergens)
  }

  const updateAllergen = (id: number, allergen: Partial<Allergen>) => {
    const newAllergens = allergens.map((a) => (a.id === id ? { ...a, ...allergen } : a))
    saveAllergens(newAllergens)
  }

  return (
    <UserContext.Provider value={{ allergens, addAllergen, removeAllergen, updateAllergen }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
