import React, { useState, useEffect } from 'react';
import {  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem, SelectTrigger, SelectValue,SelectContent } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format, parseISO } from 'date-fns';

const categories = ['Personal', 'Work', 'Travel', 'Health', 'Study'];

function App() {
  const [entries, setEntries] = useState(() => JSON.parse(localStorage.getItem('journalEntries')) || []);
  const [currentEntry, setCurrentEntry] = useState({ title: '', content: '', category: '', mood: 'Neutral', date: new Date().toISOString().split('T')[0] });
  const [filter, setFilter] = useState({ query: '', category: '', dateRange: { start: '', end: '' } });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('fontSize')) || 16);

  useEffect(() => {
    localStorage.setItem('journalEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const addOrEditEntry = () => {
    if (currentEntry.id) {
      setEntries(entries.map(e => e.id === currentEntry.id ? currentEntry : e));
    } else {
      setEntries([...entries, { ...currentEntry, id: Date.now() }]);
    }
    setCurrentEntry({ title: '', content: '', category: '', mood: 'Neutral', date: new Date().toISOString().split('T')[0] });
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const filteredEntries = entries.filter(entry => 
    (entry.title.toLowerCase().includes(filter.query.toLowerCase()) || 
     entry.content.toLowerCase().includes(filter.query.toLowerCase())) &&
    (filter.category ? entry.category === filter.category : true) &&
    (!filter.dateRange.start || !filter.dateRange.end || 
     (parseISO(entry.date) >= parseISO(filter.dateRange.start) && 
      parseISO(entry.date) <= parseISO(filter.dateRange.end)))
  );

  const wordCount = entries.reduce((sum, entry) => sum + (entry.content ? entry.content.split(' ').length : 0), 0);


  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300 p-4 sm:p-8`}>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">My Journal</h1>
        <div className="flex items-center justify-between mt-4">
          <Switch checked={darkMode} onCheckedChange={setDarkMode} className="mr-2">Dark Mode</Switch>
          <div>
            <label className="mr-2">Font Size:</label>
            <input type="number" value={fontSize} onChange={e => setFontSize(e.target.value)} min="12" max="24" className="w-16 p-1 border rounded" />
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>New Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={currentEntry.title} onChange={e => setCurrentEntry({...currentEntry, title: e.target.value})} placeholder="Title" className="mb-2" />
          <Textarea value={currentEntry.content} onChange={e => setCurrentEntry({...currentEntry, content: e.target.value})} placeholder="Your thoughts here..." className="mb-2" style={{fontSize: `${fontSize}px`}} />
          <div className="flex justify-between">
          <Select value={currentEntry.category} onValueChange={value => setCurrentEntry({...currentEntry, category: value})}>
  <SelectTrigger aria-label="Category">
    <SelectValue placeholder="Category" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">Category</SelectItem>
    {categories.map(cat => (
      <SelectItem key={cat} value={cat}>
        {cat}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
<Select value={currentEntry.mood} onValueChange={value => setCurrentEntry({...currentEntry, mood: value})}>
  <SelectTrigger aria-label="Mood">
    <SelectValue placeholder="Mood" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="Neutral">Neutral</SelectItem>
    <SelectItem value="Happy">Happy</SelectItem>
    <SelectItem value="Sad">Sad</SelectItem>
    <SelectItem value="Stressed">Stressed</SelectItem>
  </SelectContent>
</Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={addOrEditEntry}>Save Entry</Button>
        </CardFooter>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl mb-4">Search & Filter</h2>
        <Input placeholder="Search entries..." value={filter.query} onChange={e => setFilter({...filter, query: e.target.value})} className="mb-2" />
        <Select value={filter.category} onValueChange={value => setFilter({...filter, category: value})}>
  <SelectTrigger aria-label="Filter Category">
    <SelectValue placeholder="All Categories" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="">All Categories</SelectItem>
    {categories.map(cat => (
      <SelectItem key={cat} value={cat}>
        {cat}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
        <div className="mt-2">
          <Label>Date Range:</Label>
          <div className="flex space-x-2">
            <Input type="date" value={filter.dateRange.start} onChange={e => setFilter({...filter, dateRange: {...filter.dateRange, start: e.target.value}})} />
            <Input type="date" value={filter.dateRange.end} onChange={e => setFilter({...filter, dateRange: {...filter.dateRange, end: e.target.value}})} />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl mb-4">Journal Entries</h2>
        {filteredEntries.map(entry => (
          <Card key={entry.id} className="mb-4">
            <CardHeader>
              <CardTitle>{entry.title}</CardTitle>
              <CardDescription>{format(parseISO(entry.date), 'MMMM d, yyyy')}</CardDescription>
            </CardHeader>
            <CardContent>{entry.content ? entry.content.slice(0, 100) : ''}...</CardContent>
            <CardFooter className="flex justify-between">
              <div>{entry.mood} - {entry.category}</div>
              <div>
                <Button onClick={() => setCurrentEntry(entry)} className="mr-2">Edit</Button>
                <Button onClick={() => deleteEntry(entry.id)} variant="destructive">Delete</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl">Stats</h2>
        <p>Total Words Written: {wordCount}</p>
        {/* Here you could add more stats like mood distribution over time, etc. */}
      </div>
    </div>
  );
}

export default App;