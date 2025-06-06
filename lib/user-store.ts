import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Allergen {
  id: number
  name: string
  severity: "high" | "medium" | "low"
  comments: string
  dateAdded: string
}

interface UserState {
  allergens: Allergen[]
  addAllergen: (allergen: Allergen) => void
  removeAllergen: (name: string) => void
  updateAllergen: (name: string, severity: Allergen['severity']) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      allergens: [
        {
          id: 1,
          name: "Peanuts",
          severity: "high",
          comments: "Anaphylactic reaction - carry EpiPen at all times",
          dateAdded: "2023-01-15",
        },
        {
          id: 2,
          name: "Shellfish",
          severity: "medium",
          comments: "Causes hives and difficulty breathing",
          dateAdded: "2023-02-20",
        },
        {
          id: 3,
          name: "Dairy",
          severity: "low",
          comments: "Lactose intolerant - stomach discomfort",
          dateAdded: "2023-03-10",
        },
      ],
      addAllergen: (allergen) =>
        set((state) => ({
          allergens: [...state.allergens, allergen],
        })),
      removeAllergen: (name) =>
        set((state) => ({
          allergens: state.allergens.filter((a) => a.name !== name),
        })),
      updateAllergen: (name, severity) =>
        set((state) => ({
          allergens: state.allergens.map((a) =>
            a.name === name ? { ...a, severity } : a
          ),
        })),
    }),
    {
      name: "user-allergens",
    },
  ),
)
