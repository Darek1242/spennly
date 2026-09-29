import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

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
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">Podział wydatków</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              /* Dodaj to: */
              style={{ outline: "none" }}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            >
              {chartData.map((cat, i) => (
                <Cell
                  key={`cell-${i}-${cat.name}`}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
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
