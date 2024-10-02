import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const FinancialOverview = ({ finance }) => {
  const data = [
    { name: 'Income', value: finance.income },
    { name: 'Expenses', value: finance.expenses },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <h2 className="text-lg mb-2">Net Worth: ${finance.income - finance.expenses}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
              {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* More financial stats */}
    </div>
  );
};

export default FinancialOverview;
