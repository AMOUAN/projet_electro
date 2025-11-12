import React from 'react';

interface InputProps {
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  error?: string;
  label?: string;
  required?: boolean;
}

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
  icon,
  error,
  label,
  required = false,
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full rounded-xl border transition-all duration-200
            ${icon ? 'pl-10 pr-4' : 'px-4'} py-2.5
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-[#E8F4FD] focus:border-[#95C5F0] focus:ring-[#95C5F0]'}
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            disabled:bg-gray-50 disabled:cursor-not-allowed
            text-gray-900 placeholder-gray-400
            ${className}
          `}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
