import { Trash2, Edit2 } from "lucide-react";
import { db } from "../db";

export function ExpenseList({
  expenses,
  onEditExpense,
}: {
  expenses: any[];
  onEditExpense: (ex: any) => void;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-800 mb-4">Wydatki</h2>
      <ul className="space-y-2">
        {expenses
          ?.slice()
          .reverse()
          .map((ex: any) => (
            <li
              key={ex.id}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
            >
              <div>
                <p className="text-gray-600 font-medium">{ex.category}</p>
                <p className="text-xs text-gray-400">
                  {new Date(ex.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">
                  {ex.amount.toFixed(2)} PLN
                </span>
                <button
                  onClick={() => onEditExpense(ex)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => db.expenses.delete(ex.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
