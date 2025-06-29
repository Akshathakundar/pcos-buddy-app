"use client"

import { ArrowLeft } from "lucide-react"

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

interface MoodData {
  mood: number | null
  energy: number | null
}

interface ProgressViewProps {
  meals: MealEntry[]
  exercises: ExerciseEntry[]
  moodData: MoodData
  onBack: () => void
}

export default function ProgressView({ meals, exercises, moodData, onBack }: ProgressViewProps) {
  // Calculate statistics
  const totalCaloriesConsumed = meals.reduce((total, meal) => total + meal.calories, 0)
  const totalCaloriesBurned = exercises.reduce((total, ex) => total + ex.calories, 0)
  const totalExerciseTime = exercises.reduce((total, ex) => total + ex.duration, 0)
  const avgPcosScore =
    meals.length > 0 ? Math.round(meals.reduce((total, meal) => total + meal.pcosScore, 0) / meals.length) : 0

  const netCalories = totalCaloriesConsumed - totalCaloriesBurned

  // Weekly goals (mock data for demonstration)
  const weeklyGoals = {
    meals: { current: meals.length, target: 21 }, // 3 meals × 7 days
    exercise: { current: Math.round(totalExerciseTime / 60), target: 5 }, // 5 hours per week
    pcosScore: { current: avgPcosScore, target: 8 },
  }

  const achievements = [
    {
      title: "First Meal Logged",
      description: "Great start on your wellness journey!",
      earned: meals.length > 0,
      icon: "🍎",
    },
    {
      title: "Exercise Enthusiast",
      description: "Completed your first workout",
      earned: exercises.length > 0,
      icon: "💪",
    },
    {
      title: "PCOS Warrior",
      description: "Maintained high PCOS-friendly score",
      earned: avgPcosScore >= 8,
      icon: "🌟",
    },
    {
      title: "Consistency Champion",
      description: "Logged meals for all meal times",
      earned:
        meals.some((m) => m.type === "breakfast") &&
        meals.some((m) => m.type === "lunch") &&
        meals.some((m) => m.type === "dinner"),
      icon: "🏆",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Progress Overview</h1>
          <p className="text-gray-600">Track your wellness journey</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Achievements</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 transition-all ${
                achievement.earned ? "bg-yellow-50 border-yellow-300" : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-2xl ${achievement.earned ? "" : "grayscale opacity-50"}`}>{achievement.icon}</div>
                <div>
                  <h3 className={`font-semibold ${achievement.earned ? "text-yellow-800" : "text-gray-500"}`}>
                    {achievement.title}
                  </h3>
                  <p className={`text-sm ${achievement.earned ? "text-yellow-700" : "text-gray-400"}`}>
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <div className="ml-auto">
                    <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
