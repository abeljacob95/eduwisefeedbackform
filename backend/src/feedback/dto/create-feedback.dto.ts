import { IsInt, IsString, IsOptional, Min, Max, IsIn, IsEmail } from 'class-validator';

export class CreateFeedbackDto {
  // User Details
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsIn([
    'mbbs_1st_year',
    'mbbs_2nd_year',
    'mbbs_3rd_year_part_1',
    'mbbs_3rd_year_part_2',
    'mbbs_4th_year_part_1',
    'mbbs_4th_year_part_2',
    'internship',
    'house_surgency',
    'postgraduate',
    'practicing_doctor',
    'other'
  ])
  educationPhase: string;

  // Pre-assessment Ease Question (NEW)
  @IsInt()
  @Min(1)
  @Max(5)
  q0PreAssessmentEase: number;

  @IsInt()
  @Min(1)
  @Max(5)
  q1PreAssessmentRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  q2StudyPlanRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  q3McqRelevanceRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  q6DecisionHelpRating: number;

  @IsInt()
  @Min(1)
  @Max(5)
  q8TrustRating: number;

  @IsString()
  @IsIn(['worse', 'same', 'slightly_better', 'clearly_better'])
  q4ContentQuality: string;

  @IsString()
  @IsIn(['clearer', 'neutral', 'more_confused', 'tired'])
  q5MentalState: string;

  @IsString()
  @IsIn(['yes', 'maybe', 'no'])
  q7SwitchPotential: string;

  @IsOptional()
  @IsString()
  q9BetterThanCurrent?: string;

  @IsOptional()
  @IsString()
  q10MustImprove?: string;
}
