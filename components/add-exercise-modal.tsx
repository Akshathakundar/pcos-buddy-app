"use client"

import type React from "react"

import { useState } from "react"
import { X, Clock, Flame } from "lucide-react"

interface ExerciseEntry {
  name: string
  duration: number
  calories: number
  type: string
  time: string
}

interface AddExerciseModalProps {
  onClose: () => void
  onAdd: (exercise: ExerciseEntry) => void
}

const exerciseTypes = [
  { name: "Cardio", color: "bg-red-100 text-red-800" },
  { name: "Strength", color: "bg-blue-100 text-blue-800" },
  { name: "Yoga", color: "bg-green-100 text-green-800" },
  { name: "HIIT", color: "bg-orange-100 text-orange-800" },
  { name: "Walking", color: "bg-purple-100 text-purple-800" },
  { name: "Swimming", color: "bg-cyan-100 text-cyan-800" },
]

const commonExercises = [
  { name: "Brisk Walking", type: "Walking", caloriesPerMin: 4 },
  { name: "Running", type: "Cardio", caloriesPerMin: 10 },
  { name: "Yoga Flow", type: "Yoga", caloriesPerMin: 3 },
  { name: "Weight Training", type: "Strength", caloriesPerMin: 6 },
  { name: "HIIT Workout", type: "HIIT", caloriesPerMin: 12 },
  { name: "Swimming", type: "Swimming", caloriesPerMin: 8 },
  { name: "Cycling", type: "Cardio", caloriesPerMin: 7 },
  { name: "Pilates", type: "Strength", caloriesPerMin: 4 },
]

export default function AddExerciseModal({ onClose, onAdd }: AddExerciseModalProps) {
  const [selectedExercise, setSelectedExercise] = useState("")
  const [customName, setCustomName] = useState("")
  const [duration, setDuration] = useState("")
  const [selectedType, setSelectedType] = useState("Cardio")

  const calculateCalories = (exerciseName: string, minutes: number) => {
    const exercise = commonExercises.find((e) => e.name === exerciseName)
    return exercise ? exercise.caloriesPerMin * minutes : minutes * 5 // Default 5 cal/min
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const durationNum = Number.parseInt(duration) || 0
    const exerciseName = selectedExercise || customName
    const calories = selectedExercise ? calculateCalories(selectedExercise, durationNum) : durationNum * 5 // Default calculation for custom exercises

    const exerciseData: ExerciseEntry = {
      name: exerciseName,
      duration: durationNum,
      calories,
      type: selectedExercise
        ? commonExercises.find((e) => e.name === selectedExercise)?.type || selectedType
        : selectedType,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    onAdd(exerciseData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Add Exercise</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Common Exercises */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Choose Exercise</label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {commonExercises.map((exercise) => (
                <button
                  key={exercise.name}
                  type="button"
                  onClick={() => {
                    setSelectedExercise(exercise.name)
                    setCustomName("")
                    setSelectedType(exercise.type)
                  }}
                  className={`text-left p-3 rounded-lg border transition-all ${
                    selectedExercise === exercise.name
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{exercise.name}</span>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Flame size={14} />
                      {exercise.caloriesPerMin} cal/min
                    </div>
                  </div>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        exerciseTypes.find((t) => t.name === exercise.type)?.color || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {exercise.type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Exercise */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Or Add Custom Exercise</label>
            <input
              type="text"
              placeholder="Exercise name"
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value)
                setSelectedExercise("")
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Exercise Type (for custom exercises) */}
          {!selectedExercise && customName && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Exercise Type</label>
              <div className="grid grid-cols-3 gap-2">
                {exerciseTypes.map((type) => (
                  <button
                    key={type.name}
                    type="button"
                    onClick={() => setSelectedType(type.name)}
                    className={`py-2 px-3 rounded-lg border-2 transition-all ${
                      selectedType === type.name
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Duration */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={16} />
              <input
                type="number"
                placeholder="30"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Calories Preview */}
          {duration && (selectedExercise || customName) && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-800">
                <Flame size={16} />
                <span className="font-medium">
                  Estimated calories burned:{" "}
                  {selectedExercise
                    ? calculateCalories(selectedExercise, Number.parseInt(duration) || 0)
                    : (Number.parseInt(duration) || 0) * 5}{" "}
                  cal
                </span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={(!selectedExercise && !customName) || !duration}
            className="w-full bg-purple-500 text-white py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Exercise
          </button>
        </form>
      </div>
    </div>
  )
}
