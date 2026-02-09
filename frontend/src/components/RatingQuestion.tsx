interface RatingQuestionProps {
  question: string;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
}

export default function RatingQuestion({ question, value, onChange, error }: RatingQuestionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
      <div className="flex gap-2 flex-wrap">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`rating-button ${value === rating ? 'selected' : 'border-gray-300'}`}
          >
            {rating}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-sm text-gray-500 px-1">
        <span>Strongly Disagree</span>
        <span>Strongly Agree</span>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
