import React, { useState, useRef, useEffect } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SearchableSelectProps {
  label?: string;
  name?: string;
  value: string | number;
  onChange: (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => void;
  options: Option[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  error,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt: Option) => {
    setIsOpen(false);
    setSearch('');
    // Trigger onChange as if it were a normal input/select
    const syntheticEvent = {
      target: {
        name,
        value: String(opt.value),
      },
    } as unknown as React.ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
  };

  return (
    <div className="flex flex-col gap-1.5 w-full" ref={wrapperRef}>
      {label && (
        <label className="text-[clamp(0.875rem,1vw,1rem)] font-medium text-[var(--color-text-primary)]">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={`
            w-full px-3 py-2.5 rounded-lg border bg-white flex items-center justify-between cursor-pointer
            text-[clamp(0.875rem,0.9vw,0.938rem)] text-[var(--color-text-primary)]
            transition-all duration-200
            ${error ? 'border-[var(--color-error)] ring-[var(--color-error)]' : 'border-[var(--color-border)] hover:border-[var(--color-border-hover)]'}
            ${isOpen ? 'ring-2 ring-opacity-20 ring-[var(--color-primary)] border-[var(--color-primary)]' : ''}
            ${disabled ? 'bg-[var(--color-bg-base)] cursor-not-allowed opacity-75' : ''}
          `}
          onClick={() => {
            if (!disabled) {
              setIsOpen(!isOpen);
              if (!isOpen) setSearch('');
            }
          }}
        >
          <span
            className={
              selectedOption ? 'truncate' : 'text-[var(--color-text-muted)]'
            }
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-[var(--color-text-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="p-2 border-b border-[var(--color-border-light)] bg-gray-50/50">
              <input
                type="text"
                autoFocus
                className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-md focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] placeholder:text-gray-400 bg-white"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="max-h-60 overflow-y-auto w-full flex flex-col py-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[var(--color-text-muted)] text-center">
                  Tidak ada hasil
                </div>
              ) : (
                filteredOptions.map((opt) => (
                  <div
                    key={opt.value}
                    className={`
                      px-4 py-2.5 text-sm cursor-pointer transition-colors
                      hover:bg-[var(--color-bg-main)] 
                      ${String(opt.value) === String(value) ? 'bg-blue-50/50 text-[var(--color-primary)] font-medium' : 'text-[var(--color-text-primary)]'}
                    `}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-[var(--color-error)] px-1 animate-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
};
