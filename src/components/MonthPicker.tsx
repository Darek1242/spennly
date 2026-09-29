import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
];
export function MonthPicker({ currentDate, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = MONTHS[month];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold w-36 text-center cursor-pointer bg-transparent p-2"
      >
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-semibold">{monthName}</span>
          <span className="font-semibold">{year}</span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white p-4 rounded-3xl shadow-xl z-50 w-64">
          <div className="flex justify-between items-center mb-4 text-gray-700">
            <button onClick={() => onChange(new Date(year - 1, month))}>
              <ChevronLeft size={16} />
            </button>
            <span className="font-bold">{year}</span>
            <button onClick={() => onChange(new Date(year + 1, month))}>
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {MONTHS.map((m, i) => (
              <button
                key={m}
                onClick={() => {
                  onChange(new Date(year, i));
                  setIsOpen(false);
                }}
                className={`p-2 rounded-xl text-sm transition ${i === month ? "bg-green-600 text-white font-bold" : "hover:bg-gray-100 text-gray-700"}`}
              >
                {m.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
