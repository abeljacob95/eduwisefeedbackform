interface Option {
  value: string;
  label: string;
}

interface MultipleChoiceQuestionProps {
  question: string;
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export default function MultipleChoiceQuestion({
  question,
  options,
  value,
  onChange,
  error,
}: MultipleChoiceQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`option-card text-left ${value === option.value ? 'selected' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  value === option.value
                    ? 'border-brand-navy bg-brand-navy'
                    : 'border-gray-300'
                }`}
              >
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
