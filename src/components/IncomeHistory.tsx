import { Trash2, Edit2 } from "lucide-react";
import { db } from "../db";
import { supabase } from "../supabaseClient";

export function IncomeHistory({
  incomes,
  onEdit,
}: {
  incomes: any[];
  onEdit: (inc: any) => void;
}) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="font-bold text-gray-800 mb-4">Historia wpłat</h3>
      <div className="space-y-2">
        {incomes?.map((inc: any) => (
          <div
            key={inc.id}
            className="flex justify-between items-center bg-gray-50 p-4 mb-2 rounded-xl border border-gray-100"
          >
            <span className="font-semibold text-gray-700">
              {inc.amount.toFixed(2)} PLN
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(inc)}
                className="text-blue-500 hover:text-blue-700"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={async () => {
                  const {
                    data: { user },
                  } = await supabase.auth.getUser();
                  if (!user) return;

                  // 1. Usuń lokalnie
                  await db.incomes.delete(inc.id);
                  // 2. Usuń w chmurze
                  const { error } = await supabase
                    .from("incomes")
                    .delete()
                    .eq("id", inc.id)
                    .eq("user_id", user.id);

                  if (error) alert("Błąd usuwania: " + error.message);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
