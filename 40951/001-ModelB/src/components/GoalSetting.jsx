import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const GoalSetting = ({ finance, setFinance }) => {
  const [goal, setGoal] = useState({ name: '', amount: 0 });

  const addGoal = () => {
    setFinance({...finance, goals: [...finance.goals, goal]});
    setGoal({ name: '', amount: 0 });
  };

  return (
    <div className="mt-4">
      <h2 className="text-lg mb-2">Set Financial Goals</h2>
      <Input 
        value={goal.name} 
        onChange={(e) => setGoal({...goal, name: e.target.value})} 
        placeholder="Goal Name" 
      />
      <Input 
        type="number" 
        value={goal.amount} 
        onChange={(e) => setGoal({...goal, amount: e.target.value})} 
        placeholder="Amount" 
      />
      <Button onClick={addGoal}>Add Goal</Button>
      {/* Display goals here */}
    </div>
  );
};
export default GoalSetting;