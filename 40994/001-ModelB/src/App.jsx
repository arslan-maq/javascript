import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function App() {
  const [itineraries, setItineraries] = useState(() => {
    const saved = localStorage.getItem('itineraries');
    return saved ? JSON.parse(saved) : [];
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('itineraries', JSON.stringify(itineraries));
  }, [itineraries]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addItinerary = () => {
    setItineraries([...itineraries, { id: Date.now(), name: '', destination: '', activities: [] }]);
  };

  const updateItinerary = (id, field, value) => {
    setItineraries(itineraries.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    ));
  };

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div className="min-h-screen bg-background p-4 dark:bg-slate-900">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground dark:text-white">Travel Itinerary Planner</h1>
        <Switch onCheckedChange={toggleTheme} checked={theme === 'dark'} />
      </header>
      <Button onClick={addItinerary} className="mb-4">Add Itinerary</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {itineraries.map((itinerary) => (
          <Card key={itinerary.id}>
            <CardHeader>
              <CardTitle>{itinerary.name || "New Trip"}</CardTitle>
              <CardDescription>{itinerary.destination}</CardDescription>
            </CardHeader>
            <CardContent>
              <Input 
                value={itinerary.name} 
                onChange={(e) => updateItinerary(itinerary.id, 'name', e.target.value)} 
                placeholder="Trip Name" 
              />
              <Input 
                value={itinerary.destination} 
                onChange={(e) => updateItinerary(itinerary.id, 'destination', e.target.value)} 
                placeholder="Destination" 
              />
            </CardContent>
            <CardFooter>
              <p>{itinerary.activities?.length || 0} Activities</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default App;