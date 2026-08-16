import React, { useState, useRef, useEffect } from 'react';

export default function SearchableSelect({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select an option..." 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // No search filter applied as per request
  const filteredOptions = options || [];

  const selectedOption = (options || []).find(opt => opt?.value === value);

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* Select Trigger */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-800/50 border rounded-lg flex items-center justify-between cursor-pointer transition-all ${
          isOpen ? 'border-[#1890FF] ring-2 ring-[#1890FF]/20 bg-white dark:bg-[#161c24]' : 'border-gray-200 dark:border-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 dark:bg-gray-800/50'
        }`}
      >
        <span className={`text-sm ${selectedOption ? 'text-[#212b36] dark:text-white font-medium' : 'text-gray-400 dark:text-white '}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="text-gray-400 dark:text-white font-bold px-2">{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#161c24] border border-gray-100 dark:border-gray-800/50 rounded-xl shadow-[0_8px_24px_rgba(149,157,165,0.2)] overflow-hidden animate-fade-in origin-top">
          

          {/* Options List */}
          <div className="max-h-36 overflow-y-auto custom-scrollbar p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-500 dark:text-white ">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`px-3 py-1.5 rounded-lg cursor-pointer flex items-center justify-between group transition-colors ${
                    value === option.value ? 'bg-[#1890FF]/10' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 dark:bg-gray-800/50'
                  }`}
                >
                  <div>
                    <div className={`text-sm font-medium ${value === option.value ? 'text-[#1890FF]' : 'text-[#212b36] dark:text-white group-hover:text-[#1890FF]'}`}>
                      {option.label}
                    </div>
                    {option.description && (
                      <div className={`text-xs mt-0.5 ${value === option.value ? 'text-[#1890FF]/70' : 'text-[#637381] dark:text-white '}`}>
                        {option.description}
                      </div>
                    )}
                  </div>
                  {value === option.value && (
                    <span className="text-[#1890FF] font-bold text-sm shrink-0">✓</span>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
