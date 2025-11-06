import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = {
  Alto: "#ef4444",      // Rojo
  Óptimo: "#22c55e",    // Verde
  Bajo: "#f59e0b"       // Amarillo
};

export default function HumidityRing({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie 
            data={data} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            innerRadius={60} 
            outerRadius={90}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#f0fdf4', 
              border: '1px solid #86efac' 
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}