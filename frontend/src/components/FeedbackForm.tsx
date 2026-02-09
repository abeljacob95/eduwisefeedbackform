'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import RatingQuestion from './RatingQuestion';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import TextQuestion from './TextQuestion';
import InputField from './InputField';
import SelectQuestion from './SelectQuestion';

const feedbackSchema = z.object({
  // User Details
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  educationPhase: z.string().min(1, 'Please select your education phase'),
  // Questions
  q0PreAssessmentEase: z.number().min(1).max(5),
  q1PreAssessmentRating: z.number().min(1).max(5),
  q2StudyPlanRating: z.number().min(1).max(5),
  q3McqRelevanceRating: z.number().min(1).max(5),
  q6DecisionHelpRating: z.number().min(1).max(5),
  q8TrustRating: z.number().min(1).max(5),
  q4ContentQuality: z.enum(['worse', 'same', 'slightly_better', 'clearly_better']),
  q5MentalState: z.enum(['clearer', 'neutral', 'more_confused', 'tired']),
  q7SwitchPotential: z.enum(['yes', 'maybe', 'no']),
  q9BetterThanCurrent: z.string().optional(),
  q10MustImprove: z.string().optional(),
});

type FeedbackFormData = z.infer<typeof feedbackSchema>;

interface FeedbackFormProps {
  onSuccess: () => void;
}

export default function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackSchema),
  });

  const onSubmit = async (data: FeedbackFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      onSuccess();
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const educationPhaseOptions = [
    { value: 'mbbs_1st_year', label: 'MBBS 1st Year' },
    { value: 'mbbs_2nd_year', label: 'MBBS 2nd Year' },
    { value: 'mbbs_3rd_year_part_1', label: 'MBBS 3rd Year Part 1' },
    { value: 'mbbs_3rd_year_part_2', label: 'MBBS 3rd Year Part 2' },
    { value: 'mbbs_4th_year_part_1', label: 'MBBS 4th Year Part 1' },
    { value: 'mbbs_4th_year_part_2', label: 'MBBS 4th Year Part 2' },
    { value: 'internship', label: 'Internship' },
    { value: 'house_surgency', label: 'House Surgency' },
    { value: 'postgraduate', label: 'Postgraduate (MD/MS/DNB)' },
    { value: 'practicing_doctor', label: 'Practicing Doctor' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* User Details Card */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-md p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Details</h2>
        
        <InputField
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          {...register('name')}
          error={errors.name?.message}
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <InputField
          label="Phone Number"
          type="tel"
          placeholder="+91 1234567890"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />

        <SelectQuestion
          label="Current Education Phase"
          value={watch('educationPhase')}
          onChange={(val) => setValue('educationPhase', val)}
          options={educationPhaseOptions}
          error={errors.educationPhase?.message}
        />
      </div>

      {/* Feedback Questions Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Feedback</h2>
        
        {/* Q0 - NEW Pre-assessment Ease Question */}
        <RatingQuestion
          question="Q1. How easy was it to complete the pre-assessment before the content generation?"
          value={watch('q0PreAssessmentEase')}
          onChange={(val) => setValue('q0PreAssessmentEase', val)}
          error={errors.q0PreAssessmentEase?.message}
        />

        <hr className="border-gray-200" />

        {/* Q1 */}
        <RatingQuestion
          question="Q2. The pre-assessment correctly understood my preparation level"
          value={watch('q1PreAssessmentRating')}
          onChange={(val) => setValue('q1PreAssessmentRating', val)}
          error={errors.q1PreAssessmentRating?.message}
        />

        <hr className="border-gray-200" />

        {/* Q2 */}
        <RatingQuestion
          question="Q3. The study plan generated felt realistic for me"
          value={watch('q2StudyPlanRating')}
          onChange={(val) => setValue('q2StudyPlanRating', val)}
          error={errors.q2StudyPlanRating?.message}
        />

        <hr className="border-gray-200" />

        {/* Q3 */}
        <RatingQuestion
          question="Q4. The MCQs and explanations felt NEET PG or NEXT relevant"
          value={watch('q3McqRelevanceRating')}
          onChange={(val) => setValue('q3McqRelevanceRating', val)}
          error={errors.q3McqRelevanceRating?.message}
        />

        <hr className="border-gray-200" />

        {/* Q4 */}
        <MultipleChoiceQuestion
          question="Q5. Compared to my current platform (Marrow, Manipal or others), EduWise content quality felt"
          options={[
            { value: 'worse', label: 'Worse' },
            { value: 'same', label: 'Same' },
            { value: 'slightly_better', label: 'Slightly better' },
            { value: 'clearly_better', label: 'Clearly better' },
          ]}
          value={watch('q4ContentQuality')}
          onChange={(val) => setValue('q4ContentQuality', val as any)}
          error={errors.q4ContentQuality?.message}
        />

        <hr className="border-gray-200" />

        {/* Q5 */}
        <MultipleChoiceQuestion
          question="Q6. After using EduWise, I felt mentally"
          options={[
            { value: 'clearer', label: 'Clearer' },
            { value: 'neutral', label: 'Neutral' },
            { value: 'more_confused', label: 'More confused' },
            { value: 'tired', label: 'Tired' },
          ]}
          value={watch('q5MentalState')}
          onChange={(val) => setValue('q5MentalState', val as any)}
          error={errors.q5MentalState?.message}
        />

        <hr className="border-gray-200" />

        {/* Q6 */}
        <RatingQuestion
          question="Q7. EduWise helped me decide what to study next without overthinking"
          value={watch('q6DecisionHelpRating')}
          onChange={(val) => setValue('q6DecisionHelpRating', val)}
          error={errors.q6DecisionHelpRating?.message}
        />

        <hr className="border-gray-200" />

        {/* Q7 */}
        <MultipleChoiceQuestion
          question="Q8. If EduWise improves further, I can fully switch from my current platform"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'maybe', label: 'Maybe' },
            { value: 'no', label: 'No' },
          ]}
          value={watch('q7SwitchPotential')}
          onChange={(val) => setValue('q7SwitchPotential', val as any)}
          error={errors.q7SwitchPotential?.message}
        />

        <hr className="border-gray-200" />

        {/* Q8 */}
        <RatingQuestion
          question="Q9. Overall, I trust EduWise recommendations"
          value={watch('q8TrustRating')}
          onChange={(val) => setValue('q8TrustRating', val)}
          error={errors.q8TrustRating?.message}
        />

        <hr className="border-gray-200" />

        {/* Q9 */}
        <TextQuestion
          question="Q10. One thing EduWise does better than your current platform"
          placeholder="Optional: Share what you like..."
          {...register('q9BetterThanCurrent')}
          error={errors.q9BetterThanCurrent?.message}
        />

        <hr className="border-gray-200" />

        {/* Q10 */}
        <TextQuestion
          question="Q11. One thing EduWise must improve to be clearly better"
          placeholder="Optional: Share what needs improvement..."
          {...register('q10MustImprove')}
          error={errors.q10MustImprove?.message}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary text-lg px-12 py-4 shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Your responses help us improve EduWise. We respect your privacy and will only use your contact information for feedback follow-up.
      </p>
    </form>
  );
}
