import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { format, addDays } from 'date-fns';

const FitnessTracker = () => {
  const [workouts, setWorkouts] = useState(() => JSON.parse(localStorage.getItem('workouts')) || []);
  const [newWorkout, setNewWorkout] = useState({ type: '', duration: '', distance: '', calories: '', notes: '' });
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark' || false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const addWorkout = () => {
    if (newWorkout.type && newWorkout.duration) {
      setWorkouts([...workouts, { ...newWorkout, date: new Date().toISOString() }]);
      setNewWorkout({ type: '', duration: '', distance: '', calories: '', notes: '' });
    }
  };

  const deleteWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const filteredWorkouts = workouts.filter(workout => {
    if (filter === 'all') return true;
    if (filter === 'week') return new Date(workout.date) > addDays(new Date(), -7);
    if (filter === 'month') return new Date(workout.date) > addDays(new Date(), -30);
    return true;
  });

  const stats = {
    totalWorkouts: workouts.length,
    totalDistance: workouts.reduce((sum, w) => sum + Number(w.distance || 0), 0),
    totalCalories: workouts.reduce((sum, w) => sum + Number(w.calories || 0), 0),
  };

  return (
    <div className={`min-h-screen bg-background p-4 transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Fitness Tracker</h1>
        <Switch onCheckedChange={setIsDarkMode} checked={isDarkMode} />
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Add Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <Input 
            value={newWorkout.type} 
            onChange={e => setNewWorkout({...newWorkout, type: e.target.value})} 
            placeholder="Exercise Type" 
            className="mb-2"
          />
          <div className="flex space-x-2">
            <Input type="number" value={newWorkout.duration} onChange={e => setNewWorkout({...newWorkout, duration: e.target.value})} placeholder="Duration (min)" />
            <Input type="number" value={newWorkout.distance} onChange={e => setNewWorkout({...newWorkout, distance: e.target.value})} placeholder="Distance (km)" />
            <Input type="number" value={newWorkout.calories} onChange={e => setNewWorkout({...newWorkout, calories: e.target.value})} placeholder="Calories" />
          </div>
          <Button onClick={addWorkout} className="mt-4">Add</Button>
        </CardContent>
      </Card>

      <div className="mb-4">
        <Button onClick={() => setFilter('all')}>All</Button>
        <Button onClick={() => setFilter('week')}>Week</Button>
        <Button onClick={() => setFilter('month')}>Month</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredWorkouts.map((workout, index) => (
          <Card key={index}>
            <CardContent>
              <p>{format(new Date(workout.date), 'PP')}</p>
              <p>Type: {workout.type}</p>
              <p>Duration: {workout.duration} min</p>
              {workout.distance && <p>Distance: {workout.distance} km</p>}
              {workout.calories && <p>Calories: {workout.calories}</p>}
              <Button onClick={() => deleteWorkout(index)} className="mt-2 bg-destructive">Delete</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Total Workouts: {stats.totalWorkouts}</p>
          <p>Total Distance: {stats.totalDistance.toFixed(2)} km</p>
          <p>Total Calories Burned: {stats.totalCalories}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FitnessTracker;