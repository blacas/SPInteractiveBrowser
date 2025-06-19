import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Enter URL or search...",
  className = ""
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleClear = () => {
    onChange('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex-1 flex items-center gap-3 ${className}`}>
      <div className="flex items-center flex-1 bg-white/95 backdrop-blur-sm border border-slate-300 rounded-lg px-4 py-2.5 shadow-sm hover:shadow-md focus-within:shadow-md focus-within:border-blue-400 transition-all duration-200 h-10">
        <Lock className="h-4 w-4 text-emerald-600 mr-3 flex-shrink-0" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input border-0 flex-1 focus-visible:ring-0 p-0 bg-transparent text-slate-800 placeholder:text-slate-500 font-medium text-sm focus:outline-none w-full h-full"
          placeholder={placeholder}
          style={{ 
            caretColor: '#1e293b',
            fontSize: '14px',
            lineHeight: '20px',
            color: '#1e293b',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none'
          }}
          autoComplete="off"
          spellCheck={false}
          type="text"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0 ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all duration-200 flex-shrink-0"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 h-10 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md border-0 flex-shrink-0"
      >
        Go
      </Button>
    </form>
  );
};

export default SearchBar; 