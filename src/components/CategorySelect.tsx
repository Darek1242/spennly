import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function CategorySelect({ categories, value, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-200 p-3 rounded-xl bg-white flex justify-between items-center outline-none focus:ring-2 focus:ring-green-500"
      >
        {value || "Kategoria..."}
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-14 left-0 w-full bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-[60] max-h-48 overflow-y-auto">
          {categories.map((c: any) => (
            <button
              key={c.id}
              onClick={() => {
                onChange(c.name);
                setIsOpen(false);
              }}
              className="w-full text-left p-3 hover:bg-gray-50 rounded-xl font-medium text-sm"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
