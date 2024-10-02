import React, { useState, useEffect, memo } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, DollarSign, PieChart, Target, TrendingUp, BookOpen, BarChart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Wrapper components to suppress warnings
const WrappedXAxis = memo(props => <XAxis {...props} />);
const WrappedYAxis = memo(props => <YAxis {...props} />);

const Dashboard = ({ financialData, darkMode }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2" />
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${financialData.netWorth.toLocaleString()}</p>
        </CardContent>
      </Card>
      <Card className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="mr-2" />
            Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={financialData.incomeVsExpenses}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#4a5568" : "#e2e8f0"} />
              <WrappedXAxis
                dataKey="month"
                tick={{ fill: darkMode ? "#e2e8f0" : "#4a5568" }}
                axisLine={{ stroke: darkMode ? "#e2e8f0" : "#4a5568" }}
                tickLine={{ stroke: darkMode ? "#e2e8f0" : "#4a5568" }}
              />
              <WrappedYAxis
                tick={{ fill: darkMode ? "#e2e8f0" : "#4a5568" }}
                axisLine={{ stroke: darkMode ? "#e2e8f0" : "#4a5568" }}
                tickLine={{ stroke: darkMode ? "#e2e8f0" : "#4a5568" }}
              />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? "#1a202c" : "#ffffff", border: "none" }} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#4c51bf" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#e53e3e" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      {financialData.goals && financialData.goals.map((goal, index) => (
        <Card key={index} className={`${darkMode ? "bg-gray-800 text-white" : "bg-white"} shadow-lg`}>
          <CardHeader>
            <CardTitle>{goal.description}</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(goal.progress / goal.target) * 100} className="mt-2" />
            <p className="mt-2">${goal.progress.toLocaleString()} / ${goal.target.toLocaleString()}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const BudgetTracker = ({ transactions, setTransactions, updateFinancialData }) => {
  const [newTransaction, setNewTransaction] = useState({ description: "", amount: "", category: "", type: "expense" });

  const handleAddTransaction = () => {
    const updatedTransactions = [...transactions, { ...newTransaction, amount: parseFloat(newTransaction.amount) }];
    setTransactions(updatedTransactions);
    setNewTransaction({ description: "", amount: "", category: "", type: "expense" });
    
    // Update income vs expenses data
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
    
    updateFinancialData(prevData => {
      const updatedIncomeVsExpenses = [...prevData.incomeVsExpenses];
      const currentMonthData = updatedIncomeVsExpenses.find(item => item.month === currentMonth);
      
      if (currentMonthData) {
        if (newTransaction.type === "income") {
          currentMonthData.income += parseFloat(newTransaction.amount);
        } else {
          currentMonthData.expenses += parseFloat(newTransaction.amount);
        }
      } else {
        updatedIncomeVsExpenses.push({
          month: currentMonth,
          income: newTransaction.type === "income" ? parseFloat(newTransaction.amount) : 0,
          expenses: newTransaction.type === "expense" ? parseFloat(newTransaction.amount) : 0
        });
      }
      
      return {
        ...prevData,
        incomeVsExpenses: updatedIncomeVsExpenses
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Description"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
          />
          <Input
            placeholder="Category"
            value={newTransaction.category}
            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
          />
          <Select
            value={newTransaction.type}
            onValueChange={(value) => setNewTransaction({ ...newTransaction, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Transaction Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddTransaction}>Add Transaction</Button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <ul className="space-y-2">
            {transactions.slice(-5).map((transaction, index) => (
              <li key={index} className="flex justify-between">
                <span>{transaction.description}</span>
                <span className={transaction.type === "income" ? "text-green-500" : "text-red-500"}>
                  {transaction.type === "income" ? "+" : "-"}${transaction.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

const GoalSetting = ({ goals, setGoals, updateFinancialData }) => {
  const [newGoal, setNewGoal] = useState({ description: "", target: "", progress: 0 });

  const handleAddGoal = () => {
    const updatedGoals = [...(goals || []), { ...newGoal, target: parseFloat(newGoal.target), progress: parseFloat(newGoal.progress) }];
    setGoals(updatedGoals);
    setNewGoal({ description: "", target: "", progress: 0 });
    
    // Update financial data with new goals
    updateFinancialData(prevData => ({
      ...prevData,
      goals: updatedGoals
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            placeholder="Goal description"
            value={newGoal.description}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Target amount"
            value={newGoal.target}
            onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Current progress"
            value={newGoal.progress}
            onChange={(e) => setNewGoal({ ...newGoal, progress: e.target.value })}
          />
          <Button onClick={handleAddGoal}>Add Goal</Button>
        </div>
        <div className="mt-4 space-y-4">
          {goals && goals.map((goal, index) => (
            <div key={index}>
              <Label>{goal.description}</Label>
              <Progress value={(goal.progress / goal.target) * 100} className="mt-2" />
              <p className="text-sm mt-1">${goal.progress.toLocaleString()} / ${goal.target.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const InvestmentPortfolioSimulator = () => {
  const [portfolio, setPortfolio] = useState([
    { name: "Stocks", allocation: 60, returnRate: 7, volatility: 15 },
    { name: "Bonds", allocation: 30, returnRate: 3, volatility: 5 },
    { name: "Cash", allocation: 10, returnRate: 1, volatility: 0.5 }
  ]);
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [years, setYears] = useState(10);
  const [simulationResults, setSimulationResults] = useState([]);

  const runMonteCarloSimulation = () => {
    const numSimulations = 1000;
    const results = [];

    for (let i = 0; i < numSimulations; i++) {
      let balance = initialInvestment;
      const yearlyBalances = [balance];

      for (let year = 1; year <= years; year++) {
        let yearReturn = 0;
        portfolio.forEach(asset => {
          const assetReturn = asset.allocation / 100 * (
            asset.returnRate + asset.volatility * (Math.random() * 2 - 1)
          ) / 100;
          yearReturn += assetReturn;
        });
        balance *= (1 + yearReturn);
        yearlyBalances.push(balance);
      }
      results.push(yearlyBalances);
    }

    const averageResults = results[0].map((_, yearIndex) => ({
      year: yearIndex,
      average: results.reduce((sum, simulation) => sum + simulation[yearIndex], 0) / numSimulations,
      low: Math.min(...results.map(simulation => simulation[yearIndex])),
      high: Math.max(...results.map(simulation => simulation[yearIndex]))
    }));

    setSimulationResults(averageResults);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Portfolio Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Initial Investment</Label>
            <Input
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Investment Horizon (Years)</Label>
            <Input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
          {portfolio.map((asset, index) => (
            <div key={index} className="space-y-2">
              <Label>{asset.name}</Label>
              <Input
                type="number"
                placeholder="Allocation (%)"
                value={asset.allocation}
                onChange={(e) => {
                  const updatedPortfolio = [...portfolio];
                  updatedPortfolio[index].allocation = Number(e.target.value);
                  setPortfolio(updatedPortfolio);
                }}
              />
            </div>
          ))}
          <Button onClick={runMonteCarloSimulation}>Run Simulation</Button>
        </div>
        {simulationResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Simulation Results</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={simulationResults}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                <Area type="monotone" dataKey="average" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                <Area type="monotone" dataKey="high" stackId="3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const RetirementCalculator = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [expectedReturn, setExpectedReturn] = useState(7);

  const calculateRetirementSavings = () => {
    const years = retirementAge - currentAge;
    const monthlyRate = expectedReturn / 100 / 12;
    const numberOfContributions = years * 12;
    const futureValue =
      currentSavings * Math.pow(1 + monthlyRate, numberOfContributions) +
      monthlyContribution * ((Math.pow(1 + monthlyRate, numberOfContributions) - 1) / monthlyRate);
    return Math.round(futureValue);
  };

  const projectedSavings = calculateRetirementSavings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retirement Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label>Current Age</Label>
            <Input type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
          </div>
          <div>
            <Label>Retirement Age</Label>
            <Input type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
          </div>
          <div>
            <Label>Current Savings</Label>
            <Input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
          </div>
          <div>
            <Label>Monthly Contribution</Label>
            <Input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Expected Annual Return (%)</Label>
            <Input type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Projected Retirement Savings</h3>
          <p className="text-2xl font-bold">${projectedSavings.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const FinancialEducation = () => {
  const [currentTopic, setCurrentTopic] = useState(0);
  const topics = [
    { title: "Budgeting Basics", content: "Learn how to create and stick to a budget..." },
    { title: "Investing 101", content: "Understand the basics of investing and different investment vehicles..." },
    { title: "Debt Management", content: "Strategies for managing and paying off debt effectively..." },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Education Center</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={topics[currentTopic].title} className="w-full">
          <TabsList>
            {topics.map((topic, index) => (
              <TabsTrigger key={index} value={topic.title} onClick={() => setCurrentTopic(index)}>
                {topic.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {topics.map((topic, index) => (
            <TabsContent key={index} value={topic.title}>
              <p>{topic.content}</p>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className={`flex justify-between items-center py-6 px-4 ${darkMode ? "bg-gray-900" : "bg-gray-100"} transition-colors duration-300`}>
      <h1 className={`text-4xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
        <span className="text-blue-600">Fin</span>Vision
      </h1>
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"} hover:bg-opacity-80`}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

const Footer = ({ darkMode }) => {
  return (
    <footer className={`mt-8 py-6 px-4 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p>&copy; 2024 FinVision. All rights reserved.</p>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
          <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

// New utility functions for local storage
const saveToLocalStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

const loadFromLocalStorage = (key, defaultValue) => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

export default function App() {
  const [darkMode, setDarkMode] = useState(() => loadFromLocalStorage('darkMode', false));
  const [activeTab, setActiveTab] = useState(() => loadFromLocalStorage('activeTab', 'dashboard'));
  const [financialData, setFinancialData] = useState(() => loadFromLocalStorage('financialData', {
    netWorth: 100000,
    incomeVsExpenses: [
      { month: "Jan", income: 5000, expenses: 4000 },
      { month: "Feb", income: 5200, expenses: 3800 },
      { month: "Mar", income: 5100, expenses: 4200 },
    ],
    goals: [], // Ensure goals is always initialized as an empty array
  }));
  const [transactions, setTransactions] = useState(() => loadFromLocalStorage('transactions', []));
  const [goals, setGoals] = useState(() => loadFromLocalStorage('goals', []));

  // Effect hooks to save data to local storage when it changes
  useEffect(() => {
    saveToLocalStorage('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    saveToLocalStorage('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    saveToLocalStorage('financialData', financialData);
  }, [financialData]);

  useEffect(() => {
    saveToLocalStorage('transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    saveToLocalStorage('goals', goals);
  }, [goals]);

  // Wrapper function to update financialData
  const updateFinancialData = (newData) => {
    setFinancialData(prevData => ({
      ...prevData,
      ...(typeof newData === 'function' ? newData(prevData) : newData)
    }));
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-transparent border-b border-gray-200 dark:border-gray-700">
            <TabsTrigger value="dashboard" className="flex items-center"><PieChart className="mr-2" />Dashboard</TabsTrigger>
            <TabsTrigger value="budget" className="flex items-center"><DollarSign className="mr-2" />Budget</TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center"><Target className="mr-2" />Goals</TabsTrigger>
            <TabsTrigger value="retirement" className="flex items-center"><TrendingUp className="mr-2" />Retirement</TabsTrigger>
            <TabsTrigger value="investments" className="flex items-center"><BarChart className="mr-2" />Investments</TabsTrigger>
            <TabsTrigger value="education" className="flex items-center"><BookOpen className="mr-2" />Education</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <Dashboard financialData={financialData} darkMode={darkMode} />
          </TabsContent>
          <TabsContent value="budget">
            <BudgetTracker
              transactions={transactions}
              setTransactions={setTransactions}
              updateFinancialData={updateFinancialData}
            />
          </TabsContent>
          <TabsContent value="goals">
            <GoalSetting 
              goals={financialData.goals} 
              setGoals={(newGoals) => updateFinancialData({ goals: newGoals })}
              updateFinancialData={updateFinancialData}
            />
          </TabsContent>
          <TabsContent value="retirement">
            <RetirementCalculator updateFinancialData={updateFinancialData} />
          </TabsContent>
          <TabsContent value="investments">
            <InvestmentPortfolioSimulator />
          </TabsContent>
          <TabsContent value="education">
            <FinancialEducation />
          </TabsContent>
        </Tabs>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  );
}
