import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="flex h-11 w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition focus-within:border-[#0d2b4d] focus-within:shadow-[0_0_0_3px_rgba(13,43,77,0.08)]">
      <Search className="h-4 w-4 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busca un producto o categoría..."
        className="w-full border-0 bg-transparent text-sm text-[#0d2b4d] outline-none placeholder:text-slate-400"
      />
    </div>
  );
};

export default SearchBar;