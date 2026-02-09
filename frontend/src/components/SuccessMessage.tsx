export default function SuccessMessage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
            <p className="text-gray-600">
              Your feedback has been submitted successfully.
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              Your insights are invaluable in helping us build a better learning platform. 
              We&apos;ll carefully review every response.
            </p>
          </div>

          {/* EduWise Logo */}
          <div className="pt-4">
            <div className="flex items-center justify-center">
              <img 
                src="/eduwise-mark.svg" 
                alt="EduWise Logo" 
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => window.location.reload()}
            className="text-brand-navy hover:text-opacity-80 font-medium transition-colors"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    </div>
  );
}
