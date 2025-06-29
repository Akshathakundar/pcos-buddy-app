"use client"

import { useState } from "react"
import { Plus, Apple, Dumbbell, TrendingUp } from "lucide-react"
import AddMealModal from "./components/add-meal-modal"
import AddExerciseModal from "./components/add-exercise-modal"
import ProgressView from "./components/progress-view"

interface MoodData {
  mood: number | null
  energy: number | null
}

interface MealEntry {
  id: string
  type: "breakfast" | "lunch" | "dinner"
  name: string
  calories: number
  time: string
  pcosScore: number
}

interface ExerciseEntry {
  id: string
  name: string
  duration: number
  calories: number
  type: string
  time: string
}

interface MealStatus {
  breakfast: boolean
  lunch: boolean
  dinner: boolean
}

export default function App() {
  const [currentView, setCurrentView] = useState<"dashboard" | "progress">("dashboard")
  const [showMealModal, setShowMealModal] = useState(false)
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [moodData, setMoodData] = useState<MoodData>({ mood: 3, energy: 3 })
  const [meals, setMeals] = useState<MealEntry[]>([])
  const [exercises, setExercises] = useState<ExerciseEntry[]>([])

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Calculate stats
  const mealStatus: MealStatus = {
    breakfast: meals.some((m) => m.type === "breakfast"),
    lunch: meals.some((m) => m.type === "lunch"),
    dinner: meals.some((m) => m.type === "dinner"),
  }

  const mealsLogged = Object.values(mealStatus).filter(Boolean).length
  const totalMeals = 3
  const exerciseTime = exercises.reduce((total, ex) => total + ex.duration, 0)
  const pcosActivities = meals.filter((m) => m.pcosScore >= 8).length

  const handleMoodSelect = (type: "mood" | "energy", value: number) => {
    setMoodData((prev) => ({ ...prev, [type]: value }))
  }

  const handleAddMeal = (meal: Omit<MealEntry, "id">) => {
    const newMeal: MealEntry = {
      ...meal,
      id: Date.now().toString(),
    }
    setMeals((prev) => [...prev, newMeal])
    setShowMealModal(false)
  }

  const handleAddExercise = (exercise: Omit<ExerciseEntry, "id">) => {
    const newExercise: ExerciseEntry = {
      ...exercise,
      id: Date.now().toString(),
    }
    setExercises((prev) => [...prev, newExercise])
    setShowExerciseModal(false)
  }

  if (currentView === "progress") {
    return (
      <ProgressView
        meals={meals}
        exercises={exercises}
        moodData={moodData}
        onBack={() => setCurrentView("dashboard")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-2xl">🌸</div>
          <h1 className="text-3xl font-bold text-gray-800">PCOS Buddy</h1>
        </div>
        <p className="text-gray-600 mb-2">Your daily wellness companion</p>
        <p className="text-sm text-gray-500">{currentDate}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Apple className="text-red-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Meals Today</p>
              <p className="text-2xl font-bold text-gray-800">
                {mealsLogged}/{totalMeals}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(mealsLogged / totalMeals) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Dumbbell className="text-orange-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">Exercise Time</p>
              <p className="text-2xl font-bold text-gray-800">{exerciseTime}min</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((exerciseTime / 30) * 100, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-purple-500" size={24} />
            <div>
              <p className="text-sm text-gray-600">PCOS-Friendly</p>
              <p className="text-2xl font-bold text-gray-800">{pcosActivities}/1</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(pcosActivities * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Today's Meals */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Today's Meals</h2>
          <button
            onClick={() => setShowMealModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            Add Meal
          </button>
        </div>

        <div className="space-y-4">
          {[
            { name: "Breakfast", key: "breakfast" as keyof MealStatus },
            { name: "Lunch", key: "lunch" as keyof MealStatus },
            { name: "Dinner", key: "dinner" as keyof MealStatus },
          ].map((mealType) => {
            const mealEntry = meals.find((m) => m.type === mealType.key)
            return (
              <div
                key={mealType.name}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{mealType.name}</h3>
                  <p className="text-sm text-gray-500">
                    {mealEntry ? `${mealEntry.name} (${mealEntry.calories} cal)` : "Not logged yet"}
                  </p>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    mealStatus[mealType.key] ? "bg-green-500 border-green-500" : "border-red-400"
                  }`}
                >
                  {!mealStatus[mealType.key] && <div className="w-full h-full rounded-full bg-red-400"></div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Today's Exercise */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Today's Exercise</h2>
          <button
            onClick={() => setShowExerciseModal(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors"
          >
            <Plus size={16} />
            Add Exercise
          </button>
        </div>

        {exercises.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💪</div>
            <p className="text-gray-600 mb-2">No exercise logged today</p>
            <p className="text-sm text-gray-500">Click "Add Exercise" to log your first workout!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div>
                  <h3 className="font-medium text-gray-800">{exercise.name}</h3>
                  <p className="text-sm text-gray-500">
                    {exercise.duration} min • {exercise.calories} cal • {exercise.time}
                  </p>
                </div>
                <div className="text-green-500">
                  <Dumbbell size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Progress Button */}
      <div className="text-center">
        <button
          onClick={() => setCurrentView("progress")}
          className="bg-pink-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto hover:bg-pink-600 transition-colors"
        >
          <TrendingUp size={16} />
          View Progress
        </button>
      </div>

      {/* Modals */}
      {showMealModal && <AddMealModal onClose={() => setShowMealModal(false)} onAdd={handleAddMeal} />}

      {showExerciseModal && <AddExerciseModal onClose={() => setShowExerciseModal(false)} onAdd={handleAddExercise} />}
    </div>
  )
}
