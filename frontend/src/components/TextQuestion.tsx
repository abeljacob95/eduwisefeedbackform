import { forwardRef } from 'react';

interface TextQuestionProps {
  question: string;
  placeholder?: string;
  error?: string;
}

const TextQuestion = forwardRef<HTMLTextAreaElement, TextQuestionProps>(
  ({ question, placeholder, error, ...props }, ref) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
        <textarea
          ref={ref}
          placeholder={placeholder}
          rows={4}
          className="input-field resize-none"
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

TextQuestion.displayName = 'TextQuestion';

export default TextQuestion;
