// App.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar, SidebarItem } from "@/components/ui/sidebar";
import { useMediaQuery } from 'react-responsive';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [finances, setFinances] = useState({ income: 0, expenses: 0 });
  // const isMobile = useMediaQuery({ query: '(max-width: 640px)' });
  
  const toggleDarkMode = () => setDarkMode(!darkMode);

  const netWorth = finances.income - finances.expenses;

  const data = [
    { name: 'Income', value: finances.income },
    { name: 'Expenses', value: finances.expenses },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-800 dark:text-white">
        <Sidebar className={`${isMobile ? 'sm:hidden' : ''}`}>
          <SidebarItem href="#home">Home</SidebarItem>
          <SidebarItem href="#goals">Goals</SidebarItem>
          <SidebarItem href="#portfolio">Portfolio</SidebarItem>
          <SidebarItem href="#retirement">Retirement</SidebarItem>
        </Sidebar>
        <main className="p-4">
          <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
          <Card className="my-4">
            <CardHeader>
              <CardTitle>Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Input type="number" placeholder="Income" onChange={(e) => setFinances({...finances, income: +e.target.value})} />
              <Input type="number" placeholder="Expenses" className="mt-2" onChange={(e) => setFinances({...finances, expenses: +e.target.value})} />
              <p className="mt-4">Net Worth: {netWorth}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <PieChart width={400} height={400}>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default App;