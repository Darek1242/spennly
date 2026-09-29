import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function ExpenseTracker() {
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const addExpense = async () => {
    await db.expenses.add({
      amount: parseFloat(amount),
      category,
      date: new Date(),
      description: "Nowy wydatek",
    });
    setAmount("");
    setCategory("");
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Dodaj wydatek</h2>
      <input
        type="number"
        placeholder="Kwota"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <input
        type="text"
        placeholder="Kategoria"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 mb-2 w-full rounded"
      />
      <button
        onClick={addExpense}
        className="bg-green-600 text-white p-2 w-full rounded"
      >
        Zapisz
      </button>

      <ul className="mt-4">
        {expenses?.map((ex) => (
          <li key={ex.id} className="border-b py-2">
            {ex.category}: {ex.amount} PLN
          </li>
        ))}
      </ul>
    </div>
  );
}
