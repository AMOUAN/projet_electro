'use client';

interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

export default function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  return (
    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start justify-between animate-fade-in">
      <div className="flex items-start space-x-3 flex-1">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 text-green-400 hover:text-green-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

