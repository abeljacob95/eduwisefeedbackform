'use client';

import { useState } from 'react';
import FeedbackForm from '@/components/FeedbackForm';
import SuccessMessage from '@/components/SuccessMessage';

export default function Home() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return <SuccessMessage />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/eduwise-mark.svg" 
              alt="EduWise Logo" 
              className="h-20 w-auto"
            />
          </div>
          <div className="text-center mb-4">
            <h1 className="text-4xl font-bold mb-2">EduWise Beta Feedback</h1>
            <p className="text-blue-200 text-lg">Help Us Improve Medical Education</p>
          </div>
          <p className="text-blue-100 text-center max-w-2xl mx-auto">
            Thank you for testing EduWise! Your feedback is invaluable in helping us build 
            a better learning platform for medical students. Please take 3-5 minutes to share 
            your experience.
          </p>
        </div>

        {/* Form */}
        <FeedbackForm onSuccess={() => setSubmitted(true)} />
      </div>
    </main>
  );
}
