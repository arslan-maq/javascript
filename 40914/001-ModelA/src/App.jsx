// App.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const App = () => {
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('financeData')) || []);
  const [newTransaction, setNewTransaction] = useState({ type: 'expense', amount: '', category: '' });
  const [budgets, setBudgets] = useState({});

  useEffect(() => { 
    localStorage.setItem('financeData', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = () => {
    if (newTransaction.amount && newTransaction.category) {
      setTransactions([...transactions, { ...newTransaction, id: Date.now() }]);
      setNewTransaction({ type: 'expense', amount: '', category: '' });
    }
  };

  const setBudget = (category, amount) => {
    setBudgets({...budgets, [category]: amount});
  };

  const currentBudgetStatus = (category) => {
    const spent = transactions
      .filter(t => t.category === category && t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const budget = budgets[category] || 0;
    return { spent, budget, remaining: budget - spent };
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Personal Finance Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <h3 className="text-lg font-semibold">Overview</h3>
              {/* Here you would display total income, expenses, etc. */}
            </TabsContent>
            <TabsContent value="transactions">
              <Input 
                type="number" 
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
              />
              <Input 
                placeholder="Category"
                value={newTransaction.category}
                onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
              />
              <Button onClick={addTransaction}>Add Transaction</Button>
              {/* Transaction list would go here */}
            </TabsContent>
            <TabsContent value="budget">
              {Object.keys(budgets).map(category => (
                <div key={category}>
                  <span>{category}: {budgets[category]}</span>
                  <span> Remaining: {currentBudgetStatus(category).remaining}</span>
                </div>
              ))}
              <Input placeholder="New Category Budget" onBlur={(e) => {
                let value = prompt("Set budget for this category:");
                if (value) setBudget(e.target.value, parseFloat(value));
              }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;