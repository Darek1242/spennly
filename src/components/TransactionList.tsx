import { useState } from "react";
import { Trash2, Edit2, ChevronDown, ChevronRight } from "lucide-react";
import { db } from "../db";
import { supabase } from "../supabaseClient";

export function TransactionList({ expenses, onEditExpense }: any) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const grouped =
    expenses?.reduce((acc: any, curr: any) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {}) || {};

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="font-bold text-gray-800 mb-4">
        Wydatki (kliknij by rozwinąć)
      </h2>
      <ul className="space-y-2">
        {Object.entries(grouped).map(([category, items]: any, index) => {
          const total = items.reduce(
            (sum: number, item: any) => sum + item.amount,
            0,
          );
          const isExpanded = expandedCategories.includes(category);

          return (
            <li
              key={`${category}-${index}`}
              className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100 transition"
                onClick={() => toggleCategory(category)}
              >
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  {isExpanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                  {category}
                </div>
                <span className="font-bold text-gray-900">
                  {total.toFixed(2)} PLN
                </span>
              </div>

              {isExpanded && (
                <ul className="px-4 pb-4 space-y-1">
                  {items.map((ex: any) => (
                    <li
                      key={ex.id}
                      className="flex justify-between items-center text-sm py-2 border-t border-gray-200"
                    >
                      <span>{new Date(ex.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">
                          {ex.amount.toFixed(2)} PLN
                        </span>
                        <button
                          onClick={() => onEditExpense(ex)}
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={async () => {
                            const {
                              data: { user },
                            } = await supabase.auth.getUser();
                            if (!user) return;

                            await db.expenses.delete(ex.id!);
                            const { error } = await supabase
                              .from("expenses")
                              .delete()
                              .eq("id", ex.id!)
                              .eq("user_id", user.id);

                            if (error) alert("Błąd usuwania: " + error.message);
                          }}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
