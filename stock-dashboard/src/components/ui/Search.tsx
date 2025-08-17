'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

// Search result interface
interface SearchResult {
  id: string;
  symbol: string;
  name: string;
  exchange?: string;
}

// Search component props
interface SearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  loading?: boolean;
  className?: string;
  disabled?: boolean;
}

// Search component with autocomplete
export const Search: React.FC<SearchProps> = ({
  placeholder = "Search stocks...",
  onSearch,
  onSelect,
  results = [],
  loading = false,
  className,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim() && onSearch) {
      onSearch(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle key navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelect(results[selectedIndex]!);
        } else if (results.length > 0) {
          handleSelect(results[0]!);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    setQuery(result.symbol);
    setIsOpen(false);
    setSelectedIndex(-1);
    onSelect?.(result);
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle focus
  const handleFocus = () => {
    if (query.trim() && results.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={cn("relative", className)}>
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-sm sm:text-base"
          )}
        />
        
        {/* Loading indicator */}
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg
              className="animate-spin h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
        
        {/* Clear button */}
        {query && !loading && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setSelectedIndex(-1);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul className="py-1">
            {results.map((result, index) => (
              <li key={result.id}>
                <button
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors",
                    "flex items-center justify-between",
                    selectedIndex === index && "bg-blue-50 dark:bg-blue-900/20"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {result.symbol.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {result.symbol}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.name}
                      </div>
                    </div>
                  </div>
                  {result.exchange && (
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                        {result.exchange}
                      </span>
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim() && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
            No stocks found for "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

// Simple search input without autocomplete
export const SimpleSearch: React.FC<{
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
  disabled?: boolean;
}> = ({ placeholder = "Search...", onSearch, className, disabled = false }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "block w-full pl-10 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-md",
            "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-sm sm:text-base"
          )}
        />
        
        <Button
          type="submit"
          disabled={disabled || !query.trim()}
          className="absolute inset-y-0 right-0 px-3 rounded-l-none h-full"
        >
          Search
        </Button>
      </div>
    </form>
  );
};
