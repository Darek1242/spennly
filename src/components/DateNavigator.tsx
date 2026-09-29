import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

interface Props {
  currentDate: Date;
  onChange: (date: Date) => void;
}

export function DateNavigator({ currentDate, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
      <Calendar size={18} className="text-gray-500" />
      <DatePicker
        selected={currentDate}
        onChange={(date: Date | null) => date && onChange(date)}
        dateFormat="MMMM yyyy"
        showMonthYearPicker
        className="w-32 font-bold text-gray-800 bg-transparent outline-none cursor-pointer"
      />
    </div>
  );
}
