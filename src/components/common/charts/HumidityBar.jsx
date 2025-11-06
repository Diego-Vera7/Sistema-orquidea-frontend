import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

export default function HumidityBar({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
          <XAxis dataKey="dia" stroke="#065f46" />
          <YAxis unit="%" stroke="#065f46" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #86efac' 
            }}
          />
          <Legend />
          <Bar 
            dataKey="ultimos6dias" 
            fill="#22c55e" 
            name="Últimos 6 días" 
            radius={[4, 4, 0, 0]} 
          />
          <Bar 
            dataKey="semanaAnterior" 
            fill="#065f46" 
            name="Semana anterior" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}