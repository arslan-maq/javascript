import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { format } from 'date-fns';

const App = () => {
  const [itineraries, setItineraries] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const savedItineraries = JSON.parse(localStorage.getItem('itineraries') || '[]');
      setItineraries(savedItineraries);
    } catch (error) {
      console.error('Error parsing itineraries from localStorage:', error);
      setItineraries([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('itineraries', JSON.stringify(itineraries));
    } catch (error) {
      console.error('Error saving itineraries to localStorage:', error);
    }
  }, [itineraries]);

  const addItinerary = (newItinerary) => {
    setItineraries([...itineraries, { ...newItinerary, id: Date.now() }]);
  };

  const updateItinerary = (id, updatedFields) => {
    setItineraries(itineraries.map(it => it.id === id ? { ...it, ...updatedFields } : it));
  };

  const deleteItinerary = (id) => {
    setItineraries(itineraries.filter(it => it.id !== id));
  };

  const filteredItineraries = itineraries.filter(it => 
    it.destination.toLowerCase().includes(searchTerm.toLowerCase()) || 
    it.tripName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl">Travel Itinerary Planner</h1>
        <Switch checked={darkMode} onCheckedChange={setDarkMode} className="ml-4">Dark Mode</Switch>
      </header>
      <div className="container mx-auto p-4">
        <Input 
          placeholder="Search itineraries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full"
        />
        <ItineraryForm onSubmit={addItinerary} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItineraries.map(it => (
            <ItineraryCard key={it.id} itinerary={it} onUpdate={updateItinerary} onDelete={deleteItinerary} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Components

const ItineraryForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ tripName: '', destination: '', startDate: '', endDate: '' });

  const submitForm = (e) => {
    e.preventDefault();
    if (form.tripName && form.destination) {
      onSubmit(form);
      setForm({ tripName: '', destination: '', startDate: '', endDate: '' });
    }
  };

  return (
    <form onSubmit={submitForm} className="mb-4">
      <Input value={form.tripName} onChange={e => setForm({...form, tripName: e.target.value})} placeholder="Trip Name" className="mr-2 mb-2" />
      <Input value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="Destination" className="mr-2 mb-2" />
      <Input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="mr-2 mb-2" />
      <Input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="mr-2 mb-2" />
      <Button type="submit">Add Itinerary</Button>
    </form>
  );
};

const ItineraryCard = ({ itinerary, onUpdate, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{itinerary.tripName}</CardTitle>
        <CardDescription>{itinerary.destination}</CardDescription>
      </CardHeader>
      <CardContent>
        {itinerary.startDate && itinerary.endDate ? (
          <p>{format(new Date(itinerary.startDate), 'PPP')} to {format(new Date(itinerary.endDate), 'PPP')}</p>
        ) : (
          <p>Dates not specified</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={() => onDelete(itinerary.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default App;