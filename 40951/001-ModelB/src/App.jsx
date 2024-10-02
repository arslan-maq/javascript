import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from './hooks/useLocalStorage';
import FinancialOverview from './components/FinancialOverview';
import GoalSetting from './components/GoalSetting';
import InvestmentSimulator from './components/InvestmentSimulator';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [userFinance, setUserFinance] = useLocalStorage('financeData', { income: 0, expenses: 0, goals: [] });

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen bg-background ${darkMode ? 'dark' : ''}`}>
      <header className="p-4 bg-primary text-primary-foreground">
        <h1 className="text-2xl font-bold">FinVision</h1>
        <Button onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</Button>
      </header>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialOverview finance={userFinance} />
          </CardContent>
        </Card>
        <GoalSetting finance={userFinance} setFinance={setUserFinance} />
        <InvestmentSimulator />
        {/* Additional components like DebtStrategy, LearningModule would go here */}
      </div>
    </div>
  );
};

export default App;