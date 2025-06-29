"use client"

import type React from "react"

import { useState } from "react"
import { X, Search } from "lucide-react"

interface MealEntry {
  type: "breakfast" | "lunch" | "dinner"
  name: string
  calories: number
  time: string
  pcosScore: number
}

interface AddMealModalProps {
  onClose: () => void
  onAdd: (meal: MealEntry) => void
}

const commonFoods = [
  { name: "Greek Yogurt with Berries", calories: 150, pcosScore: 9 },
  { name: "Avocado Toast", calories: 280, pcosScore: 8 },
  { name: "Quinoa Salad", calories: 320, pcosScore: 9 },
  { name: "Grilled Chicken Breast", calories: 185, pcosScore: 8 },
  { name: "Salmon with Vegetables", calories: 350, pcosScore: 10 },
  { name: "Oatmeal with Nuts", calories: 220, pcosScore: 8 },
  { name: "Sweet Potato", calories: 112, pcosScore: 9 },
  { name: "Mixed Green Salad", calories: 80, pcosScore: 9 },
]

export default function AddMealModal({ onClose, onAdd }: AddMealModalProps) {
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner">("breakfast")
  const [selectedFood, setSelectedFood] = useState("")
  const [customName, setCustomName] = useState("")
  const [calories, setCalories] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredFoods = commonFoods.filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let mealData: MealEntry

    if (selectedFood) {
      const food = commonFoods.find((f) => f.name === selectedFood)!
      mealData = {
        type: mealType,
        name: food.name,
        calories: food.calories,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        pcosScore: food.pcosScore,
      }
    } else {
      mealData = {
        type: mealType,
        name: customName,
        calories: Number.parseInt(calories) || 0,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        pcosScore: 7, // Default score for custom meals
      }
    }

    onAdd(mealData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add Meal</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Meal Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
            <div className="grid grid-cols-3 gap-2">
              {["breakfast", "lunch", "dinner"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMealType(type as any)}
                  className={`py-2 px-3 rounded-lg border-2 capitalize transition-all ${
                    mealType === type
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Food Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Common Foods</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Food Options */}
          <div className="mb-6 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {filteredFoods.map((food) => (
                <button
                  key={food.name}
                  type="button"
                  onClick={() => {
                    setSelectedFood(food.name)
                    setCustomName("")
                    setCalories("")
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedFood === food.name
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{food.name}</span>
                    <div className="text-sm text-gray-500">
                      {food.calories} cal
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        PCOS: {food.pcosScore}/10
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Food */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Add Custom Food</label>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Food name"
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value)
                  setSelectedFood("")
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFood && (!customName || !calories)}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Meal
          </button>
        </form>
      </div>
    </div>
  )
}
