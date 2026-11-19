import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { registerLocale } from "react-datepicker";
import { pl } from "date-fns/locale/pl";
registerLocale("pl", pl);

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

const quickRanges = [
  {
    label: "Ten miesiąc",
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  },
  {
    label: "Poprzedni",
    start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
  },
  {
    label: "3 m-ce",
    start: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    end: new Date(),
  },
  {
    label: "Ten rok",
    start: new Date(new Date().getFullYear(), 0, 1),
    end: new Date(),
  },
];

export function ReportView({ walletId }: { walletId: number | null }) {
  // DODANO walletId
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), 0, 1),
  );
  const [endDate, setEndDate] = useState(new Date());

  const setRange = (r: { start: Date; end: Date }) => {
    setStartDate(r.start);
    setEndDate(r.end);
  };

  // 1. Obliczamy zakresy dla porównania
  const diffTime = endDate.getTime() - startDate.getTime();
  const prevStartDate = new Date(startDate.getTime() - diffTime);
  const prevEndDate = new Date(endDate.getTime() - diffTime);

  // 2. Pobieramy wydatki z bieżącego okresu
  const currentExpenses = useLiveQuery(
    () =>
      db.expenses
        .where("wallet_id")
        .equals(walletId || 0)
        .filter(
          (e) => new Date(e.date) >= startDate && new Date(e.date) <= endDate,
        )
        .toArray(),
    [startDate, endDate, walletId],
  );

  // 3. Pobieramy wydatki z poprzedniego okresu (do porównania)
  const prevExpenses = useLiveQuery(
    () =>
      db.expenses
        .where("wallet_id")
        .equals(walletId || 0)
        .filter(
          (e) =>
            new Date(e.date) >= prevStartDate &&
            new Date(e.date) <= prevEndDate,
        )
        .toArray(),
    [startDate, endDate, walletId],
  );

  // Pobierz wszystkie wydatki z ostatnich 6 miesięcy
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const last6MonthsData = useLiveQuery(
    () =>
      db.expenses
        .where("wallet_id")
        .equals(walletId || 0)
        .filter((e) => new Date(e.date) >= sixMonthsAgo)
        .toArray(),
    [walletId],
  );

  // Agregacja po miesiącach
  const barData = [5, 4, 3, 2, 1, 0].map((i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthName = d.toLocaleString("pl-PL", { month: "short" });

    const total =
      last6MonthsData
        ?.filter((e) => {
          const ed = new Date(e.date);
          return (
            ed.getMonth() === d.getMonth() &&
            ed.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, e) => sum + e.amount, 0) || 0;

    return { name: monthName, value: total };
  });

  const getPercentageChange = (category: string, currentTotal: number) => {
    const prevTotal =
      prevExpenses
        ?.filter((e) => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0) || 0;

    if (prevTotal === 0) return null; // Brak porównania
    const change = ((currentTotal - prevTotal) / prevTotal) * 100;
    return change.toFixed(1);
  };

  const expenses = currentExpenses;

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
        {/* Szybkie wybory - przewijane na mobilkach, centrowane na desktopie */}
        <div className="flex justify-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickRanges.map((r) => (
            <button
              key={r.label}
              onClick={() => {
                setStartDate(r.start);
                setEndDate(r.end);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-semibold whitespace-nowrap transition"
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Kalendarz - wyśrodkowany */}
        <div className="flex justify-center items-center gap-2">
          <DatePicker
            selected={startDate}
            onChange={(d: Date | null) => d && setStartDate(d)}
            dateFormat="dd/MM/yyyy"
            locale="pl"
            customInput={
              <input
                className="bg-gray-50 p-3 rounded-xl w-32 text-center cursor-pointer"
                inputMode="none"
                readOnly={true}
              />
            }
          />
          <span className="text-gray-400">—</span>
          <DatePicker
            selected={endDate}
            onChange={(d: Date | null) => d && setEndDate(d)}
            dateFormat="dd/MM/yyyy"
            locale="pl"
            customInput={
              <input
                className="bg-gray-50 p-3 rounded-xl w-32 text-center cursor-pointer"
                inputMode="none"
                readOnly={true}
              />
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-3xl shadow-sm h-auto flex flex-col items-center">
          <h3 className="font-bold text-gray-800 mb-4">Podział wydatków</h3>
          <div className="w-full h-[300px]">
            {" "}
            {/* Stała wysokość */}
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={80} // Mniejszy promień dla lepszego dopasowania
                  dataKey="value"
                  isAnimationActive={false}
                  style={{ outline: "none" }}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                {/* Zmieniamy legendę na bardziej przyjazną mobilnie */}
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Szczegółowa rozpiska</h3>
          <div className="space-y-3">
            {categoryData.map((cat, i) => {
              const change = getPercentageChange(cat.name, cat.value);
              return (
                <div
                  key={cat.name}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <div>
                      <span className="font-medium text-gray-700">
                        {cat.name}
                      </span>
                      {change && (
                        <p
                          className={`text-[10px] ${
                            Number(change) > 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {Number(change) > 0 ? "+" : ""}
                          {change}% vs poprzedni okres
                        </p>
                      )}
                    </div>
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
              );
            })}
          </div>
        </div>
        <div className="bg-white p-8 rounded-3xl shadow-sm h-96">
          <h3 className="font-bold text-gray-800 mb-6">
            Wydatki w ostatnich 6 miesiącach
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
