import { FaMagnifyingGlass } from "react-icons/fa6";
import { CiCircleInfo } from "react-icons/ci";
import { ChangeEvent, KeyboardEvent } from "react";

interface SearchBarProps {
  id?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function SearchBar({ id, placeholder, value, onChange, onSearch, onKeyDown }: SearchBarProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-12 rounded-2xl border border-glacier-500 bg-glacier-700/40 text-white placeholder-glacier-300 focus:outline-none focus:ring-2 focus:ring-glacier-400/70 transition-all shadow-sm"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          autoComplete="off"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-glacier-300 hover:text-white hover:scale-115 active:scale-85 transition-all delay-100"
          aria-label="Search"
          onClick={onSearch}>
          <FaMagnifyingGlass className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
