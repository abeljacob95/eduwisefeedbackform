import React from 'react';

interface SelectQuestionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

const SelectQuestion = React.forwardRef<HTMLSelectElement, SelectQuestionProps>(
  ({ label, value, onChange, options, error, required = true }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-base md:text-lg font-medium text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base`}
        >
          <option value="">-- Select an option --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

SelectQuestion.displayName = 'SelectQuestion';

export default SelectQuestion;
