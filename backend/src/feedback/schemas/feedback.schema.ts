import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema({ timestamps: true })
export class Feedback {
  // User Details
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ 
    required: true, 
    enum: [
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
    ] 
  })
  educationPhase: string;

  // Pre-assessment Ease Question (NEW)
  @Prop({ required: true, min: 1, max: 5 })
  q0PreAssessmentEase: number;

  @Prop({ required: true, min: 1, max: 5 })
  q1PreAssessmentRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  q2StudyPlanRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  q3McqRelevanceRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  q6DecisionHelpRating: number;

  @Prop({ required: true, min: 1, max: 5 })
  q8TrustRating: number;

  @Prop({ 
    required: true, 
    enum: ['worse', 'same', 'slightly_better', 'clearly_better'] 
  })
  q4ContentQuality: string;

  @Prop({ 
    required: true, 
    enum: ['clearer', 'neutral', 'more_confused', 'tired'] 
  })
  q5MentalState: string;

  @Prop({ 
    required: true, 
    enum: ['yes', 'maybe', 'no'] 
  })
  q7SwitchPotential: string;

  @Prop()
  q9BetterThanCurrent?: string;

  @Prop()
  q10MustImprove?: string;

  @Prop()
  userAgent?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  sessionId?: string;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);

// Add indexes for common queries
FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ email: 1 });
FeedbackSchema.index({ educationPhase: 1 });
