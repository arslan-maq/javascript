import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const InvestmentSimulator = () => {
  const data = [
    {name: '2023', uv: 4000, pv: 2400, amt: 2400},
    // ... more data points for simulation
  ];

  return (
    <div className="mt-4">
      <h2 className="text-lg mb-2">Investment Simulation</h2>
      <LineChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      </LineChart>
    </div>
  );
};
export default InvestmentSimulator;