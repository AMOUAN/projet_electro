import React from 'react';

interface SelectProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
}

export default function Select({
  value,
  onChange,
  children,
  className = '',
  disabled = false,
  label,
  error,
  required = false,
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-xl border transition-all duration-200
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-[#E8F4FD] focus:border-[#95C5F0] focus:ring-[#95C5F0]'}
          focus:outline-none focus:ring-2 focus:ring-opacity-50
          disabled:bg-gray-50 disabled:cursor-not-allowed
          text-gray-900
          ${className}
        `}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
