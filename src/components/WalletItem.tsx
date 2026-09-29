import { Trash2, Edit2 } from "lucide-react";

export function WalletItem({ wallet, isPremium, onDelete, onEditClick }: any) {
  return (
    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl border border-gray-100">
      <span className="flex-1 font-medium text-gray-800">{wallet.name}</span>

      {/* Przycisk edycji */}
      <button
        onClick={() => onEditClick(wallet)}
        className="text-gray-400 hover:text-blue-600 p-2"
      >
        <Edit2 size={18} />
      </button>

      {/* Przycisk usuwania */}
      {isPremium && (
        <button
          onClick={() => onDelete(wallet.id)}
          className="text-red-500 hover:text-red-700 p-2"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
