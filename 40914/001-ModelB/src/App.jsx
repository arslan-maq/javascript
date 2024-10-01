import React, { useState, useEffect, useReducer } from 'react';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card";
import { 
  Button
} from "@/components/ui/button";
import { 
  Input
} from "@/components/ui/input";
import { 
  Label
} from "@/components/ui/label";

import { format } from 'date-fns';

// Initial state for our finance manager 
const initialState = {
  transactions: [],
  budgets: {},
  savingsGoals: [],
};

// Reducer to handle state changes
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'SET_BUDGET':
      return { ...state, budgets: { ...state.budgets, [action.payload.category]: action.payload.amount } };
    case 'UPDATE_SAVINGS':
      return { ...state, savingsGoals: state.savingsGoals.map(goal => 
        goal.id === action.payload.id ? { ...goal, currentAmount: action.payload.amount } : goal
      )};
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// Component for adding transactions
function AddTransaction({ dispatch }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    dispatch({
      type: 'ADD_TRANSACTION',
      payload: { type, amount: parseFloat(amount), category, date, id: Date.now() }
    });
    setAmount('');
    setCategory('');
  };

  return (
    <Card className="sm:w-96">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="transactionType">Type</Label>
            {/* <Select id="transactionType" value={type} onChange={(e) => setType(e.target.value)}>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select> */}
            <select
              id="transactionType" value={type} onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
            <Label htmlFor="category">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Food, Rent, etc." />
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button type="submit">Add</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Budget Tracker Component
function BudgetTracker({ budgets, transactions, dispatch }) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    dispatch({
      type: 'SET_BUDGET',
      payload: { category, amount: parseFloat(amount) }
    });
    setAmount('');
    setCategory('');
  };

  const budgetLeft = (cat) => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === cat)
      .reduce((sum, t) => sum + t.amount, 0);
    return (budgets[cat] || 0) - spent;
  };

  return (
    <Card className="sm:w-96">
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBudgetSubmit}>
          <Label htmlFor="budgetCategory">Category</Label>
          <Input id="budgetCategory" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
          <Label htmlFor="budgetAmount">Amount</Label>
          <Input id="budgetAmount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          <Button type="submit">Set Budget</Button>
        </form>
        <div className="mt-4">
          {Object.keys(budgets).map(cat => (
            <div key={cat} className="flex justify-between mb-2">
              <span>{cat}</span>
              <span className={budgetLeft(cat) < 0 ? "text-red-500" : "text-green-500"}>
                ${budgetLeft(cat).toFixed(2)} left
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Savings Goal Component
function SavingsGoals({ savingsGoals, dispatch }) {
  const [goal, setGoal] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    if (!goal || !target || !deadline) return;
    const newGoal = {
      id: Date.now(),
      goal,
      target: parseFloat(target),
      deadline: new Date(deadline),
      currentAmount: 0,
    };
    dispatch({ type: 'UPDATE_SAVINGS', payload: { id: newGoal.id, amount: 0 } });
    setGoal('');
    setTarget('');
    setDeadline('');
  };

  return (
    <Card className="sm:w-96">
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGoalSubmit}>
          <Label htmlFor="savingsGoal">Goal</Label>
          <Input id="savingsGoal" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="Vacation" />
          <Label htmlFor="targetAmount">Target</Label>
          <Input id="targetAmount" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="1000" />
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          <Button type="submit">Add Goal</Button>
        </form>
        <div className="mt-4">
          {savingsGoals.map(goal => (
            <div key={goal.id} className="mb-2">
              <p>{goal.goal} - ${goal.currentAmount}/${goal.target} by {format(goal.deadline, 'MM/dd/yyyy')}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Main App Component
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [localState, setLocalState] = useLocalStorage('financeManager', state);

  useEffect(() => {
    setLocalState(state);
  }, [state, setLocalState]);

  const totalIncome = state.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = state.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const resetData = () => dispatch({ type: 'RESET' });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Personal Finance Manager</h1>
      <Button onClick={resetData} className="mb-4">Reset All Data</Button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AddTransaction dispatch={dispatch} />
        <BudgetTracker budgets={state.budgets} transactions={state.transactions} dispatch={dispatch} />
        <SavingsGoals savingsGoals={state.savingsGoals} dispatch={dispatch} />
        <Card className="sm:w-96">
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Income: ${totalIncome.toFixed(2)}</p>
            <p>Expenses: ${totalExpense.toFixed(2)}</p>
            <p>Savings: ${(totalIncome - totalExpense).toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}