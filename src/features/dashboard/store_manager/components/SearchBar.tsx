import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="px-5 flex flex-row items-center h-16 w-full border-brand-navy border-2 rounded-2xl">
      <Search />
      <input placeholder="Busca algo" className="px-3 border-0 focus:border-none focus:outline-none w-full"></input>
    </div>
  );
};

export default SearchBar;
