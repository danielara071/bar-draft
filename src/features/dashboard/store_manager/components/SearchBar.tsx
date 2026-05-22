import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="px-5 flex flex-row items-center h-16 w-full border-brand-navy border-2 rounded-2xl">
      <Search />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Busca algo"
        className="px-3 border-0 focus:border-none focus:outline-none w-full"
      />
    </div>
  );
};

export default SearchBar;