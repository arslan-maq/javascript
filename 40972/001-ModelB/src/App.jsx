// App.jsx
import React, { useState, useEffect } from 'react';
// import { Button, Input, Textarea, Select, SelectItem, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui";
import {  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';

const moods = ['Happy', 'Sad', 'Stressed', 'Excited', 'Neutral'];

export default function App() {
  const [entries, setEntries] = useState(JSON.parse(localStorage.getItem('journalEntries')) || []);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', category: '', mood: '' });
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || '16px');

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('fontSize', fontSize);
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [entries, isDarkMode, fontSize]);

  const addEntry = () => {
    if (newEntry.title && newEntry.content) {
      setEntries([...entries, { ...newEntry, date: new Date().toISOString() }]);
      setNewEntry({ title: '', content: '', category: '', mood: '' });
    }
  };

  const deleteEntry = (index) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={cn("min-h-screen p-4", isDarkMode ? "dark" : "")}>
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Journal</h1>
        <Button onClick={toggleDarkMode}>Toggle Theme</Button>
      </header>
      
      <div style={{ fontSize: fontSize }} className="space-y-4">
        <Input 
          value={newEntry.title} 
          onChange={e => setNewEntry({...newEntry, title: e.target.value})}
          placeholder="Title"
        />
        <Textarea 
          value={newEntry.content} 
          onChange={e => setNewEntry({...newEntry, content: e.target.value})}
          placeholder="Write your thoughts here..."
        />
        <Select value={newEntry.category} onValueChange={(val) => setNewEntry({...newEntry, category: val})}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Personal">Personal</SelectItem>
            <SelectItem value="Work">Work</SelectItem>
            <SelectItem value="Travel">Travel</SelectItem>
          </SelectContent>
        </Select>
        <Select value={newEntry.mood} onValueChange={(val) => setNewEntry({...newEntry, mood: val})}>
          <SelectTrigger>
            <SelectValue placeholder="Choose Mood" />
          </SelectTrigger>
          <SelectContent>
            {moods.map(mood => (
              <SelectItem key={mood} value={mood}>
                {mood}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={addEntry}>Add Entry</Button>
        <input 
          type="range" 
          min="12" max="24" 
          value={fontSize.replace('px', '')} 
          onChange={(e) => setFontSize(`${e.target.value}px`)} 
        />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription>{format(new Date(entry.date), 'PP')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{entry.content.slice(0, 100)}...</p>
              <p><strong>Category:</strong> {entry.category}</p>
              <p><strong>Mood:</strong> {entry.mood}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" onClick={() => deleteEntry(index)}>Delete</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}