import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Moon, Sun, Plane, MapPin, Clock, Calendar, Plus, Edit, Trash2, Github } from 'lucide-react';

const App = () => {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Load trips and darkMode state from local storage
  useEffect(() => {
    const storedTrips = JSON.parse(localStorage.getItem('trips')) || [];
    setTrips(storedTrips);
    const storedDarkMode = JSON.parse(localStorage.getItem('darkMode')) || false; // Load darkMode state
    setDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  // Save trips and darkMode state before unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('trips', JSON.stringify(trips));
      localStorage.setItem('darkMode', JSON.stringify(darkMode)); // Save darkMode state
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [trips, darkMode]);

  const addTrip = (newTrip) => {
    setTrips([...trips, { ...newTrip, id: Date.now().toString(), activities: [] }]);
  };

  const updateTrip = (updatedTrip) => {
    setTrips(trips.map(trip => trip.id === updatedTrip.id ? updatedTrip : trip));
  };

  const deleteTrip = (tripId) => {
    setTrips(trips.filter(trip => trip.id !== tripId));
    setSelectedTrip(null);
  };

  const addActivity = (tripId, newActivity) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, activities: [...trip.activities, { ...newActivity, id: Date.now().toString() }] };
      }
      return trip;
    }));
  };

  const updateActivity = (tripId, updatedActivity) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          activities: trip.activities.map(activity =>
            activity.id === updatedActivity.id ? updatedActivity : activity
          )
        };
      }
      return trip;
    }));
  };

  const deleteActivity = (tripId, activityId) => {
    setTrips(trips.map(trip => {
      if (trip.id === tripId) {
        return {
          ...trip,
          activities: trip.activities.filter(activity => activity.id !== activityId)
        };
      }
      return trip;
    }));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark', newDarkMode); // Toggle dark class on body
  };

  const filteredTrips = trips.filter(trip => 
    trip.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!dateRange.start || new Date(trip.startDate) >= new Date(dateRange.start)) &&
    (!dateRange.end || new Date(trip.endDate) <= new Date(dateRange.end))
  );

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <header className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Plane className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Travel Planner</h1>
          </div>
          <Button onClick={toggleDarkMode} variant="outline" size="icon">
            {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <MapPin className="h-5 w-5" />
            <Input
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <Input
              type="date"
              placeholder="Start date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="flex-grow"
            />
            <Input
              type="date"
              placeholder="End date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="flex-grow"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <TripList
              trips={filteredTrips}
              onSelectTrip={setSelectedTrip}
              onAddTrip={addTrip}
              onDeleteTrip={deleteTrip}
            />
          </div>
          <div className="md:col-span-2">
            {selectedTrip ? (
              <TripDetails
                trip={selectedTrip}
                onUpdateTrip={updateTrip}
                onAddActivity={addActivity}
                onUpdateActivity={updateActivity}
                onDeleteActivity={deleteActivity}
              />
            ) : (
              <Card>
                <CardContent>
                  <p className="text-center py-4">Please select a trip to view details</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        <TripDurationChart trips={filteredTrips} />
      </main>

      <footer className={`mt-8 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Travel Planner. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-blue-500 hover:text-blue-600">
              <Github className="h-5 w-5 inline-block mr-1" />
              GitHub
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-600">
              <MapPin className="h-5 w-5 inline-block mr-1" />
              About Us
            </a>
            <a href="#" className="text-blue-500 hover:text-blue-600">
              <Clock className="h-5 w-5 inline-block mr-1" />
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const TripList = ({ trips, onSelectTrip, onAddTrip, onDeleteTrip }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <Plane className="h-6 w-6 mr-2" />
        Your Trips
      </h2>
      <ScrollArea className="h-[calc(100vh-300px)]">
        {trips.length > 0 ? (
          trips.map(trip => (
            <Card key={trip.id} className="mb-4 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {trip.name}
                </CardTitle>
                <CardDescription>{trip.destination}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => onSelectTrip(trip)} className="mr-2">
                  <Edit className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="destructive" onClick={() => onDeleteTrip(trip.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="text-center py-4">No trips found. Please create a new trip.</p>
        )}
      </ScrollArea>
      <AddTripDialog onAddTrip={onAddTrip} />
    </div>
  );
};

const AddTripDialog = ({ onAddTrip }) => {
  const [open, setOpen] = useState(false);
  const [newTrip, setNewTrip] = useState({ name: '', destination: '', startDate: '', endDate: '', notes: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTrip(newTrip);
    setNewTrip({ name: '', destination: '', startDate: '', endDate: '', notes: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add New Trip
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            Add New Trip
          </DialogTitle>
          <DialogDescription className="dark:text-gray-300">Create a new trip itinerary.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newTrip.name}
                onChange={(e) => setNewTrip({ ...newTrip, name: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter trip name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">Destination</Label>
              <Input
                id="destination"
                value={newTrip.destination}
                onChange={(e) => setNewTrip({ ...newTrip, destination: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newTrip.startDate}
                onChange={(e) => setNewTrip({ ...newTrip, startDate: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newTrip.endDate}
                onChange={(e) => setNewTrip({ ...newTrip, endDate: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea
                id="notes"
                value={newTrip.notes}
                onChange={(e) => setNewTrip({ ...newTrip, notes: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Trip</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const TripDetails = ({ trip, onUpdateTrip, onAddActivity, onUpdateActivity, onDeleteActivity }) => {
  const [editing, setEditing] = useState(false);
  const [editedTrip, setEditedTrip] = useState(trip);

  const handleSave = () => {
    onUpdateTrip(editedTrip);
    setEditing(false);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{editing ? <Input value={editedTrip.name} onChange={(e) => setEditedTrip({ ...editedTrip, name: e.target.value })} /> : trip.name}</CardTitle>
          <CardDescription>{editing ? <Input value={editedTrip.destination} onChange={(e) => setEditedTrip({ ...editedTrip, destination: e.target.value })} /> : trip.destination}</CardDescription>
        </CardHeader>
        <CardContent>
          {editing ? (
            <>
              <Label>Start Date</Label>
              <Input type="date" value={editedTrip.startDate} onChange={(e) => setEditedTrip({ ...editedTrip, startDate: e.target.value })} />
              <Label>End Date</Label>
              <Input type="date" value={editedTrip.endDate} onChange={(e) => setEditedTrip({ ...editedTrip, endDate: e.target.value })} />
              <Label>Notes</Label>
              <Textarea value={editedTrip.notes} onChange={(e) => setEditedTrip({ ...editedTrip, notes: e.target.value })} />
            </>
          ) : (
            <>
              <p>Start Date: {trip.startDate}</p>
              <p>End Date: {trip.endDate}</p>
              <p>Notes: {trip.notes}</p>
            </>
          )}
        </CardContent>
        <CardFooter>
          {editing ? (
            <Button onClick={handleSave}>Save</Button>
          ) : (
            <Button onClick={() => setEditing(true)}>Edit</Button>
          )}
        </CardFooter>
      </Card>

      <h3 className="text-xl font-semibold mt-6 mb-4">Activities</h3>
      {trip.activities.length > 0 ? (
        trip.activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            onUpdateActivity={(updatedActivity) => onUpdateActivity(trip.id, updatedActivity)}
            onDeleteActivity={() => onDeleteActivity(trip.id, activity.id)}
          />
        ))
      ) : (
        <p className="text-center py-4">No activities added yet.</p>
      )}
      <AddActivityDialog onAddActivity={(newActivity) => onAddActivity(trip.id, newActivity)} />
    </div>
  );
};

const ActivityItem = ({ activity, onUpdateActivity, onDeleteActivity }) => {
  const [editing, setEditing] = useState(false);
  const [editedActivity, setEditedActivity] = useState(activity);

  const handleSave = () => {
    onUpdateActivity(editedActivity);
    setEditing(false);
  };

  return (
    <Card className="mb-4 dark:bg-gray-800 dark:text-white">
      <CardHeader>
      <CardTitle>
          {editing ? (
            <Input 
              value={editedActivity.name} 
              onChange={(e) => setEditedActivity({ ...editedActivity, name: e.target.value })}
              className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
            />
          ) : activity.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {editing ? (
          <>
            <Label className="dark:text-gray-300">Description</Label>
            <Textarea value={editedActivity.description} onChange={(e) => setEditedActivity({ ...editedActivity, description: e.target.value })} className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
            <Label className="dark:text-gray-300">Location</Label>
            <Input className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" value={editedActivity.location} onChange={(e) => setEditedActivity({ ...editedActivity, location: e.target.value })} />
            <Label className="dark:text-gray-300">Time</Label>
            <Input className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" type="time" value={editedActivity.time} onChange={(e) => setEditedActivity({ ...editedActivity, time: e.target.value })} />
            <Label className="dark:text-gray-300">Duration (minutes)</Label>
            <Input className="dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" type="number" value={editedActivity.duration} onChange={(e) => setEditedActivity({ ...editedActivity, duration: e.target.value })} />
          </>
        ) : (
          <>
            <p>{activity.description}</p>
            <p>Location: {activity.location}</p>
            <p>Time: {activity.time}</p>
            <p>Duration: {activity.duration} minutes</p>
          </>
        )}
      </CardContent>
      <CardFooter>
        {editing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <>
            <Button onClick={() => setEditing(true)} className="mr-2">Edit</Button>
            <Button variant="destructive" onClick={onDeleteActivity}>Delete</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

const AddActivityDialog = ({ onAddActivity }) => {
  const [open, setOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({ name: '', description: '', location: '', time: '', duration: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddActivity(newActivity);
    setNewActivity({ name: '', description: '', location: '', time: '', duration: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">Add New Activity</Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black dark:bg-gray-800 dark:text-white">
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogDescription className="dark:text-gray-300">Create a new activity for your trip.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input
                id="name"
                value={newActivity.name}
                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">Location</Label>
              <Input
                id="location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Time</Label>
              <Input
                id="time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                className="col-span-3 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Activity</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};


const TripDurationChart = ({ trips }) => {
  const data = trips.map(trip => ({
    name: trip.name,
    duration: calculateTripDuration(trip.startDate, trip.endDate)
  }));

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="h-6 w-6 mr-2" />
          Trip Duration Chart
        </CardTitle>
      </CardHeader>
      <CardContent>
        {trips.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Bar dataKey="duration" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center py-4">No trip data available for chart.</p>
        )}
      </CardContent>
    </Card>
  );
};

const calculateTripDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default App;

