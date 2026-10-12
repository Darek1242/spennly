import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function ChartComponent({
  expenses,
  categories,
}: {
  expenses: any[];
  categories: any[];
}) {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const chartData = categories
    .map((cat) => ({
      name: cat.name,
      value: expenses
        .filter((e) => e.category === cat.name)
        .reduce((sum, e) => sum + e.amount, 0),
    }))
    .filter((d) => d.value > 0);

  return (
    <div className="bg-white p-4 rounded-3xl shadow-sm h-auto flex flex-col items-center">
      <h3 className="font-bold text-gray-800 mb-4">Podział wydatków</h3>
      <div className="w-full h-[350px]">
        {" "}
        {/* Ustal sztywną wysokość dla mobilki */}
        <ResponsiveContainer width="100%" height={350}>
          <PieChart margin={{ top: 20, right: 0, bottom: 40, left: 0 }}>
            {" "}
            {/* Dodaj marginesy */}
            <Pie
              data={chartData}
              innerRadius={60} // Zmniejsz trochę, żeby napisy się mieściły
              outerRadius={80} // Zmniejsz, żeby koło nie "puchło" do krawędzi
              paddingAngle={5}
              dataKey="value"
              style={{ outline: "none" }}
            >
              {chartData.map((cat, i) => (
                <Cell
                  key={`cell-${i}-${cat.name}`}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            {/* Zmieniamy legendę na bardziej przyjazną mobilnie */}
            <Legend verticalAlign="bottom" height={36} />{" "}
            {/* Przesuń legendę niżej */}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2 w-full">
        {chartData.map((cat, i) => (
          <div
            key={cat.name + i}
            className="flex justify-between items-center text-sm border-t border-gray-100 pt-2 mt-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span className="text-gray-600">{cat.name}</span>
            </div>
            <span className="font-bold text-gray-900">
              {cat.value.toFixed(2)} PLN{" "}
              <span className="text-gray-400 font-normal">
                ({((cat.value / (totalExpenses || 1)) * 100).toFixed(1)}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
