import React, { InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  className?: string;
}

const SearchBox = ({ 
  value, 
  onChange, 
  onClear, 
  className = '',
  placeholder = 'Search...',
  ...props 
}: SearchBoxProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="w-4 h-4 text-light-3" />
      </div>
      
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`bg-dark-4 border-none text-light-1 text-sm rounded-lg block w-full pl-10 pr-10 p-2.5 focus:ring-primary-500 focus:border-primary-500 ${className}`}
        placeholder={placeholder}
        {...props}
      />
      
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>))}
          className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-light-3 hover:text-light-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBox; 