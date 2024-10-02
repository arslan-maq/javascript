// App.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toggle } from "@/components/ui/toggle";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const App = () => {
  const [workouts, setWorkouts] = useState([]);
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '', distance: '', calories: '', notes: '' });
  const [theme, setTheme] = useState('light');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const savedTheme = localStorage.getItem('theme') || 'light';
    setWorkouts(savedWorkouts);
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
    localStorage.setItem('theme', theme);
  }, [workouts, theme]);

  const addWorkout = () => {
    if (newWorkout.type && newWorkout.duration) {
      setWorkouts([...workouts, { ...newWorkout, date: new Date().toISOString() }]);
      setNewWorkout({ type: '', duration: '', distance: '', calories: '', notes: '' });
    }
  };

  const deleteWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const totalDistance = workouts.reduce((sum, workout) => sum + parseFloat(workout.distance || 0), 0);
  const totalCalories = workouts.reduce((sum, workout) => sum + parseInt(workout.calories || 0), 0);

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    const today = new Date();
    const workoutDate = new Date(workout.date);
    if (filter === 'week') return (today - workoutDate) / (1000 * 60 * 60 * 24) <= 7;
    if (filter === 'month') return workoutDate.getMonth() === today.getMonth();
  });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto p-4">
        <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="mb-4">
          Toggle Theme
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Add Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={newWorkout.type} onChange={(e) => setNewWorkout({...newWorkout, type: e.target.value})} placeholder="Exercise Type" className="mb-2" />
            <Input type="number" value={newWorkout.duration} onChange={(e) => setNewWorkout({...newWorkout, duration: e.target.value})} placeholder="Duration (min)" className="mb-2" />
            <Button onClick={addWorkout}>Add</Button>
          </CardContent>
        </Card>
        
        <div className="mt-4">
          <Label>Filter:</Label>
          <select onChange={(e) => setFilter(e.target.value)} value={filter} className="ml-2">
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkouts.map((workout, index) => (
            <Card key={index}>
              <CardContent>
                <p>{workout.type} - {workout.duration} min</p>
                <Button onClick={() => deleteWorkout(index)}>Delete</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <LineChart width={500} height={300} data={workouts}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid stroke="#eee" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="calories" stroke="#8884d8" />
        </LineChart>
      </div>
    </div>
  );
};

export default App;