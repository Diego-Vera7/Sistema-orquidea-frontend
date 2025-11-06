import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function TemperatureLine({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
          <XAxis dataKey="dia" stroke="#065f46" />
          <YAxis unit="°C" stroke="#065f46" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #86efac' 
            }}
          />
          <Line 
            type="monotone" 
            dataKey="temperatura" 
            stroke="#10b981" 
            strokeWidth={3} 
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}