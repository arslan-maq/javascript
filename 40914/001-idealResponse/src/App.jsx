// src/App.js
import React, { useState, useEffect, createContext, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// FinanceContext for global state management
const FinanceContext = createContext();
const useFinance = () => useContext(FinanceContext);

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  // Load data from local storage 
  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    const storedBudgets = JSON.parse(localStorage.getItem("budgets")) || [];
    setTransactions(storedTransactions);
    setBudgets(storedBudgets);
  }, []);

  // Save data to local storage whenever transactions/budgets change
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    localStorage.setItem("budgets", JSON.stringify(budgets));

    const incomeTotal = transactions.reduce(
      (acc, trans) => (trans.type === "income" ? acc + trans.amount : acc),
      0
    );
    const expenseTotal = transactions.reduce(
      (acc, trans) => (trans.type === "expense" ? acc + trans.amount : acc),
      0
    );

    setIncome(incomeTotal);
    setExpenses(expenseTotal);
  }, [transactions, budgets]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const addBudget = (budget) => {
    setBudgets([...budgets, budget]);
  };

  const value = {
    transactions,
    budgets,
    addTransaction,
    addBudget,
    income,
    expenses,
  };

  return (
    <FinanceContext.Provider value={value}>
      <div className="container mx-auto p-4">
        <Dashboard />
        <TransactionManager />
        <BudgetTracker />
        <TransactionHistory /> {/* Adding Transaction History */}
        <Analytics />
      </div>
    </FinanceContext.Provider>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { income, expenses } = useFinance();
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-6">
      <Card className="bg-green-100">
        <CardHeader>
          <CardTitle>Total Income</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">${income}</CardContent>
      </Card>
      <Card className="bg-red-100">
        <CardHeader>
          <CardTitle>Total Expenses</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">${expenses}</CardContent>
      </Card>
    </div>
  );
};

// Transaction Manager Component
const TransactionManager = () => {
  const { addTransaction } = useFinance();
  const [form, setForm] = useState({ type: "expense", amount: "", category: "", date: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTransaction({ ...form, amount: parseFloat(form.amount) });
    setForm({ type: "expense", amount: "", category: "", date: "" });
  };

  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Transaction</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              className="border rounded p-2"
            />
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="border rounded p-2"
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
              className="border rounded p-2"
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="border rounded p-2"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Add Transaction
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Budget Tracker Component
const BudgetTracker = () => {
  const { budgets, addBudget, transactions } = useFinance();
  const [form, setForm] = useState({ category: "", amount: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    addBudget({ ...form, amount: parseFloat(form.amount) });
    setForm({ category: "", amount: "" });
  };

  const getTotalSpent = (category) => {
    return transactions
      .filter((trans) => trans.category === category && trans.type === "expense")
      .reduce((acc, trans) => acc + trans.amount, 0);
  };

  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Budget</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="border rounded p-2"
            />
            <input
              type="number"
              placeholder="Budget Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              className="border rounded p-2"
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">
              Add Budget
            </button>
          </form>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length > 0 ? (
            <ul>
              {budgets.map((budget, idx) => {
                const spent = getTotalSpent(budget.category);
                const percentage = ((spent / budget.amount) * 100).toFixed(0);

                return (
                  <li key={idx} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span>{budget.category} - ${spent} / ${budget.amount}</span>
                      <span className={percentage > 100 ? "text-red-600" : "text-green-600"}>
                        {percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full ${
                          percentage > 100 ? "bg-red-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No budgets set</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// Transaction History Component
const TransactionHistory = () => {
  const { transactions } = useFinance();

  return (
    <div className="mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm border">
            <thead>
              <tr>
                <th className="border-b p-2 text-left">Date</th>
                <th className="border-b p-2 text-left">Category</th>
                <th className="border-b p-2 text-left">Type</th>
                <th className="border-b p-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((trans, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-2">{trans.date}</td>
                    <td className="p-2">{trans.category}</td>
                    <td className="p-2 capitalize">{trans.type}</td>
                    <td className={`p-2 ${trans.type === "expense" ? "text-red-600" : "text-green-600"}`}>
                      ${trans.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 text-center" colSpan="4">
                    No transactions recorded
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

// Analytics Component
const Analytics = () => {
  const { transactions } = useFinance();
  const categories = transactions.reduce((acc, trans) => {
    acc[trans.category] = (acc[trans.category] || 0) + trans.amount;
    return acc;
  }, {});

  const maxAmount = Math.max(...Object.values(categories), 1); // Avoid divide by zero

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Spending Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.keys(categories).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(categories).map(([category, amount]) => (
              <div key={category}>
                <div className="flex justify-between mb-1 text-sm">
                  <span>{category}</span>
                  <span>${amount.toFixed(2)}</span>
                </div>
                <div className="bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(amount / maxAmount) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No transactions available for analytics</p>
        )}
      </CardContent>
    </Card>
  );
};

export default App;
