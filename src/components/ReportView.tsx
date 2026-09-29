import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

export function ReportView({ walletId }: { walletId: number | null }) {
  // DODANO walletId
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1),
  );
  const [endDate, setEndDate] = useState(new Date());

  // POPRAWIONE ZAPYTANIE - dodano filtrowanie po wallet_id
  const expenses = useLiveQuery(
    () =>
      db.expenses
        .where("wallet_id")
        .equals(walletId || 0) // Tylko dane z aktywnego portfela
        .filter((e) => {
          const d = new Date(e.date);
          return d >= startDate && d <= endDate;
        })
        .toArray(),
    [startDate, endDate, walletId], // Reaguj na zmianę portfela
  );

  const categoryData =
    expenses?.reduce((acc: any[], curr) => {
      const existing = acc.find((e) => e.name === curr.category);
      if (existing) existing.value += curr.amount;
      else acc.push({ name: curr.category, value: curr.amount });
      return acc;
    }, []) || [];

  const totalSpent = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="font-bold text-gray-800">Zakres:</span>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <DatePicker
              selected={startDate}
              onChange={(d: Date | null) => d && setStartDate(d)}
              className="bg-gray-50 p-3 rounded-xl w-32 text-center cursor-pointer"
            />
            <span className="hidden sm:block">—</span>
            <DatePicker
              selected={endDate}
              onChange={(d: Date | null) => d && setEndDate(d)}
              className="bg-gray-50 p-3 rounded-xl w-32 text-center cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-3xl shadow-sm h-96">
          <h3 className="font-bold text-gray-800 mb-6">
            Wydatki: {totalSpent.toFixed(2)} PLN
          </h3>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={categoryData}
                innerRadius={80}
                outerRadius={120}
                dataKey="value"
                style={{ outline: "none" }} // Usunięcie ramki przy kliknięciu
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Szczegółowa rozpiska</h3>
          <div className="space-y-3">
            {categoryData.map((cat, i) => (
              <div
                key={cat.name}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="font-medium text-gray-700">{cat.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {cat.value.toFixed(2)} PLN
                  </p>
                  <p className="text-xs text-gray-400">
                    {((cat.value / (totalSpent || 1)) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
