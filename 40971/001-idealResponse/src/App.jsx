import React, { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Sun, Moon, Dumbbell, Calendar, Download, Activity, Clock, MapPin, Flame, FileText, Edit, Trash2, Target, Weight, TrendingUp } from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export default function App() {
  const [workouts, setWorkouts] = useState(() => JSON.parse(localStorage.getItem("workouts")) || []);
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem("goals")) || { distance: 0, weight: 0 });
  const [newWorkout, setNewWorkout] = useState({ type: "", duration: "", distance: "", calories: "", notes: "" });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitWorkout = (e) => {
    e.preventDefault();
    if (newWorkout.type && newWorkout.duration) {
      if (isEditing) {
        setWorkouts((prev) =>
          prev.map((workout, index) => (index === editIndex ? { ...newWorkout, date: new Date() } : workout))
        );
        setIsEditing(false);
        setEditIndex(null);
      } else {
        setWorkouts((prev) => [...prev, { ...newWorkout, date: new Date() }]);
      }
      setNewWorkout({ type: "", duration: "", distance: "", calories: "", notes: "" });
    }
  };

  const handleEditWorkout = (index) => {
    setNewWorkout(workouts[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteWorkout = (index) => {
    setWorkouts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGoalChange = (e) => {
    const { name, value } = e.target;
    setGoals((prev) => ({ ...prev, [name]: value }));
  };

  // New filtering logic
  const filteredWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    const today = new Date();
    
    switch (filter) {
      case "today":
        return workoutDate.toDateString() === today.toDateString();
      case "thisWeek":
        return workoutDate >= startOfWeek(today) && workoutDate <= endOfWeek(today);
      case "thisMonth":
        return workoutDate >= startOfMonth(today) && workoutDate <= endOfMonth(today);
      default:
        return true;
    }
  });

  const totalDistance = filteredWorkouts.reduce((acc, workout) => acc + (parseFloat(workout.distance) || 0), 0);
  const totalCalories = filteredWorkouts.reduce((acc, workout) => acc + (parseFloat(workout.calories) || 0), 0);

  const chartData = filteredWorkouts.map((w) => ({
    date: format(new Date(w.date), "MMM dd"),
    calories: parseFloat(w.calories) || 0,
  }));

  const downloadCSV = () => {
    const csvRows = [];
    const headers = ["Type", "Duration", "Distance", "Calories", "Notes", "Date"];
    csvRows.push(headers.join(","));

    filteredWorkouts.forEach((workout) => {
      const values = [
        workout.type,
        workout.duration,
        workout.distance,
        workout.calories,
        workout.notes,
        format(new Date(workout.date), "yyyy-MM-dd"),
      ];
      csvRows.push(values.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", "workouts.csv");
    a.click();
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Enhanced Header */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Fitness Tracker</h1>
          </div>
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="outline"
            size="icon"
            className="rounded-full bg-white text-purple-600 hover:bg-purple-100"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 space-y-6">
        {/* Filter Options */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardContent className="flex items-center space-x-4 py-4">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <select
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-gray-700 dark:text-gray-300"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
            </select>
          </CardContent>
        </Card>

        {/* Log Workout Form */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardContent className="space-y-4">
            <CardTitle className="text-2xl font-bold mt-4 text-purple-600 dark:text-purple-400 flex items-center space-x-2">
              <Activity className="w-6 h-6" />
              <span>{isEditing ? "Edit Workout" : "Log a Workout"}</span>
            </CardTitle>
            <form onSubmit={handleSubmitWorkout} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5 text-gray-400" />
                  <Input name="type" placeholder="Exercise Type" value={newWorkout.type} onChange={handleInputChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <Input name="duration" type="number" placeholder="Duration (mins)" value={newWorkout.duration} onChange={handleInputChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <Input name="distance" type="number" placeholder="Distance (miles)" value={newWorkout.distance} onChange={handleInputChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="w-5 h-5 text-gray-400" />
                  <Input name="calories" type="number" placeholder="Calories Burned" value={newWorkout.calories} onChange={handleInputChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <Input name="notes" placeholder="Notes" value={newWorkout.notes} onChange={handleInputChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
                {isEditing ? "Update Workout" : "Add Workout"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Workouts List */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardContent className="space-y-4">
            <CardTitle className="text-2xl font-bold mt-4 text-purple-600 dark:text-purple-400 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>Your Workouts</span>
            </CardTitle>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredWorkouts.map((workout, index) => (
                <li key={index} className="py-4 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Dumbbell className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-semibold">{workout.type}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{workout.duration} mins - {format(new Date(workout.date), "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="space-x-2 flex items-center">
                    <Button onClick={() => handleEditWorkout(index)} variant="outline" size="sm" className="flex items-center space-x-1">
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteWorkout(index)} className="flex items-center space-x-1">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
            <Button onClick={downloadCSV} className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </Button>
          </CardContent>
        </Card>

        {/* Goals and Progress */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardContent className="space-y-4">
            <CardTitle className="text-2xl font-bold mt-4 text-purple-600 dark:text-purple-400 flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Goals &amp; Progress</span>
            </CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <Input name="distance" type="number" placeholder="Distance Goal (miles)" value={goals.distance} onChange={handleGoalChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
              </div>
              <div className="flex items-center space-x-2">
                <Weight className="w-5 h-5 text-gray-400" />
                <Input name="weight" type="number" placeholder="Weight Goal" value={goals.weight} onChange={handleGoalChange} className="bg-gray-50 dark:bg-gray-700 flex-grow" />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>Total Distance: {totalDistance} miles</span>
                </p>
                <Progress value={(totalDistance / goals.distance) * 100} className="h-2 mt-2" />
              </div>
              <div>
                <p className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Total Calories Burned: {totalCalories}</span>
                </p>
                <Progress value={(totalCalories / goals.weight) * 100} className="h-2 mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Chart */}
        <Card className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <CardContent className="space-y-4">
            <CardTitle className="text-2xl font-bold mt-4 text-purple-600 dark:text-purple-400 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6" />
              <span>Progress Chart</span>
            </CardTitle>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="date" 
                  stroke={isDarkMode ? "#9CA3AF" : "#4B5563"}
                  tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563" }}
                />
                <YAxis 
                  stroke={isDarkMode ? "#9CA3AF" : "#4B5563"}
                  tick={{ fill: isDarkMode ? "#9CA3AF" : "#4B5563" }}
                />
                <Tooltip contentStyle={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF", color: isDarkMode ? "#FFFFFF" : "#1F2937", border: "none", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }} />
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#E5E7EB"} />
                <Line type="monotone" dataKey="calories" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: "#8B5CF6", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg mt-6">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <p className="text-sm">© 2024 Fitness Tracker. All rights reserved.</p>
          <div className="flex space-x-4">
            <Dumbbell className="w-5 h-5" />
            <Activity className="w-5 h-5" />
            <Target className="w-5 h-5" />
          </div>
        </div>
      </footer>
    </div>
  );
}