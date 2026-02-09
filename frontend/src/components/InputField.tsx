import React from 'react';

interface InputFieldProps {
  label: string;
  type: 'text' | 'email' | 'tel';
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type, placeholder, error, required = true, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label className="block text-base md:text-lg font-medium text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-lg border ${
            error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-base`}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
