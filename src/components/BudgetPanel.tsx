export function BudgetPanel({ balance, totalIncome, totalExpenses }: any) {
  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <p className="text-gray-500 text-sm">Pozostało budżetu</p>
      <h1 className="text-4xl font-bold text-gray-900 mt-1">
        {balance.toFixed(2)} PLN
      </h1>
      <div className="flex gap-4 mt-6 text-sm font-semibold">
        <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full">
          Wpływy: +{totalIncome.toFixed(2)}
        </span>
        <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full">
          Wydatki: -{totalExpenses.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
