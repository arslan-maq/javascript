import React, { useState, useEffect, useCallback } from 'react';
import { Moon, Sun, Search, Plus, Trash2, Edit, Calendar, Settings, RefreshCw, Book, PenTool } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MOODS = ['😊 Happy', '😢 Sad', '😠 Angry', '😌 Relaxed', '😰 Stressed'];
const CATEGORIES = ['Personal', 'Work', 'Travel', 'Health', 'Other'];

function JournalEntry({ entry, onEdit, onDelete }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{entry.title}</CardTitle>
        <CardDescription>{new Date(entry.date).toLocaleDateString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{entry.body.substring(0, 100)}...</p>
        <div className="mt-2">
          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1 mr-2">{entry.category}</span>
          <span className="text-xs bg-yellow-100 text-yellow-800 rounded-full px-2 py-1">{entry.mood}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" onClick={() => onEdit(entry)} className="mr-2">
          <Edit className="w-4 h-4 mr-2" /> Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onDelete(entry.id)}>
          <Trash2 className="w-4 h-4 mr-2" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

function EntryForm({ entry, onSave, onCancel }) {
  const [title, setTitle] = useState(entry?.title || '');
  const [body, setBody] = useState(entry?.body || '');
  const [category, setCategory] = useState(entry?.category || CATEGORIES[0]);
  const [mood, setMood] = useState(entry?.mood || MOODS[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: entry?.id, title, body, category, mood, date: entry?.date || new Date().toISOString() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry Title"
        required
      />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your journal entry here..."
        required
        className="h-40"
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={mood} onValueChange={setMood}>
        <SelectTrigger>
          <SelectValue placeholder="How are you feeling?" />
        </SelectTrigger>
        <SelectContent>
          {MOODS.map((m) => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Entry</Button>
      </div>
    </form>
  );
}

function SearchFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleFilter = (category) => {
    setFilterCategory(category);
    onFilter(category);
  };

  return (
    <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
      <div className="flex-1 flex space-x-2">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search entries..."
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4" />
        </Button>
      </div>
      <Select value={filterCategory} onValueChange={handleFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function MoodChart({ entries }) {
  const moodCounts = MOODS.reduce((acc, mood) => {
    acc[mood] = entries.filter(entry => entry.mood === mood).length;
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Mood Overview</h3>
      {entries.length > 0 ? (
        <div className="flex items-end space-x-2 h-40">
          {Object.entries(moodCounts).map(([mood, count]) => (
            <div key={mood} className="flex flex-col items-center">
              <div className="bg-blue-500 w-8" style={{ height: `${count * 10}%` }}></div>
              <span className="text-xs mt-1">{mood.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      ) : (
        <p>No entries yet. Start journaling to see your mood overview!</p>
      )}
    </div>
  );
}

function MoodLineChart({ entries }) {
  const moodData = entries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    mood: MOODS.indexOf(entry.mood)
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Mood Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis 
              tickFormatter={(value) => MOODS[value]?.split(' ')[0] || ''} 
              domain={[0, MOODS.length - 1]}
              ticks={[0, 1, 2, 3, 4]}
            />
            <Tooltip 
              labelFormatter={(value) => `Date: ${value}`} 
              formatter={(value) => [MOODS[value], 'Mood']} 
            />
            <Legend />
            <Line type="monotone" dataKey="mood" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


function ReflectionSummary({ entries }) {
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  
  const recentEntries = entries.filter(entry => new Date(entry.date) >= lastMonth);
  const entryCount = recentEntries.length;
  
  const moodCounts = recentEntries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});
  
  const dominantMood = Object.entries(moodCounts).reduce((a, b) => a[1] > b[1] ? a : b, [null, 0])[0];

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Monthly Reflection</CardTitle>
      </CardHeader>
      <CardContent>
        <p>In the last month, you've written {entryCount} journal entries.</p>
        {dominantMood && (
          <p>Your dominant mood has been {dominantMood}.</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [entries, setEntries] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [lastEntryDate, setLastEntryDate] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadData = useCallback(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    const storedDarkMode = localStorage.getItem('darkMode');
    
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries);
      setEntries(parsedEntries);
      setFilteredEntries(parsedEntries);
      updateLastEntryDate(parsedEntries);
      updateWordCount(parsedEntries);
    }

    if (storedDarkMode !== null) {
      const parsedDarkMode = JSON.parse(storedDarkMode);
      setDarkMode(parsedDarkMode);
      if (parsedDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    loadData();
    setIsInitialized(true);
  }, [loadData]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    }
  }, [entries, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode, isInitialized]);

  const updateLastEntryDate = (entries) => {
    const sortedEntries = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));
    setLastEntryDate(sortedEntries[0]?.date || null);
  };

  const updateWordCount = (entries) => {
    const totalWords = entries.reduce((acc, entry) => acc + entry.body.split(/\s+/).length, 0);
    setWordCount(totalWords);
  };

  const handleSave = (entry) => {
    const updatedEntries = entry.id
      ? entries.map(e => e.id === entry.id ? entry : e)
      : [...entries, { ...entry, id: Date.now() }];
    setEntries(updatedEntries);
    setFilteredEntries(updatedEntries);
    setIsEditing(false);
    setCurrentEntry(null);
  };

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    setFilteredEntries(updatedEntries);
  };

  const handleSearch = (searchTerm) => {
    const filtered = entries.filter(entry =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  const handleFilter = (category) => {
    if (category === 'all') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry => entry.category === category);
      setFilteredEntries(filtered);
    }
  };

  const exportEntries = () => {
    const dataStr = JSON.stringify(entries);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'journal_entries.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const showRandomEntry = () => {
    if (entries.length > 0) {
      const randomIndex = Math.floor(Math.random() * entries.length);
      setCurrentEntry(entries[randomIndex]);
      setIsEditing(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Book className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Personal Journal</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setDarkMode(!darkMode)} className="bg-white text-blue-600 hover:bg-blue-100">
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={exportEntries} className="bg-white text-blue-600 hover:bg-blue-100">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="max-w-6xl mx-auto">
          {lastEntryDate && new Date() - new Date(lastEntryDate) > 86400000 && (
            <Alert className="mb-6 bg-yellow-100 border-yellow-400 text-yellow-800">
              <Calendar className="h-4 w-4" />
              <AlertTitle>Reminder</AlertTitle>
              <AlertDescription>
                It's been a while since your last entry. How about writing one today?
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-6 flex justify-between items-center">
            <p className="text-lg font-semibold">Total Words Written: {wordCount}</p>
            <Button onClick={() => { setIsEditing(true); setCurrentEntry(null); }} className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="w-4 h-4 mr-2" /> New Entry
            </Button>
          </div>

          <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-blue-50 mb-4">
                <CardTitle className="text-blue-800">Journal Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">Total Entries: <span className="font-bold">{entries.length}</span></p>
                <p className="text-lg">Last Entry: <span className="font-bold">{lastEntryDate ? new Date(lastEntryDate).toLocaleDateString() : 'No entries yet'}</span></p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-green-50 mb-4">
                <CardTitle className="text-green-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* <Button onClick={showRandomEntry} className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" /> Random Entry
                </Button> */}
                <Button onClick={exportEntries} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white">
                  Export Entries
                </Button>
              </CardContent>
            </Card>
          </div>

          <ReflectionSummary entries={entries} />

          <div className="space-y-6 mt-6">
            {filteredEntries.length > 0 ? (
              filteredEntries.map(entry => (
                <JournalEntry
                  key={entry.id}
                  entry={entry}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <Card className="bg-white shadow-lg p-6 text-center">
                <p className="text-gray-600 text-lg">No entries found. Try adjusting your search or filter, or add a new entry!</p>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-pink-50">
                <CardTitle className="text-pink-800">Mood Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodChart entries={filteredEntries} />
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-purple-800">Mood Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <MoodLineChart entries={entries} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-4 mt-8">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p>&copy; 2024 Personal Journal App</p>
          <div className="flex items-center space-x-4">
            <a href="#" className="hover:text-blue-300">Privacy Policy</a>
            <a href="#" className="hover:text-blue-300">Terms of Service</a>
          </div>
        </div>
      </footer>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentEntry ? 'Edit Entry' : 'New Entry'}</DialogTitle>
          </DialogHeader>
          <EntryForm
            entry={currentEntry}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={currentEntry !== null && !isEditing} onOpenChange={() => setCurrentEntry(null)}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{currentEntry?.title}</DialogTitle>
            <DialogDescription>{new Date(currentEntry?.date).toLocaleDateString()}</DialogDescription>
          </DialogHeader>
          <p className="mt-2 text-gray-700 dark:text-gray-300">{currentEntry?.body}</p>
          <DialogFooter>
            <Button onClick={() => setCurrentEntry(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}