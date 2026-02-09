import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedbackService } from '../feedback/feedback.service';
import * as AWS from 'aws-sdk';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private ses: AWS.SES;

  constructor(private readonly feedbackService: FeedbackService) {
    // Initialize AWS SES
    this.ses = new AWS.SES({
      region: process.env.AWS_REGION || 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
  }

  /**
   * Scheduled job that runs every day at 12:00 AM
   * Sends an email with all feedback received that day
   */
  @Cron('0 0 * * *', {
    name: 'daily-feedback-report',
    timeZone: 'UTC', // Change to your timezone if needed
  })
  async sendDailyFeedbackReport() {
    try {
      this.logger.log('Starting daily feedback report job...');

      // Get start and end of today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      // Fetch today's feedback
      const todaysFeedback = await this.feedbackService.findByDateRange(
        startOfDay,
        endOfDay,
      );

      if (todaysFeedback.length === 0) {
        this.logger.log('No feedback received today. Skipping email.');
        return;
      }

      this.logger.log(
        `Found ${todaysFeedback.length} feedback entries for today`,
      );

      // Generate email content
      const emailBody = this.generateEmailBody(todaysFeedback, startOfDay);

      // Send email via Amazon SES
      await this.sendEmail(emailBody, todaysFeedback.length, startOfDay);

      this.logger.log('Daily feedback report sent successfully');
    } catch (error) {
      this.logger.error('Failed to send daily feedback report', error);
    }
  }

  /**
   * Generate HTML email body with feedback data
   */
  private generateEmailBody(feedbackList: any[], date: Date): string {
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    let html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .summary { background-color: #F3F4F6; padding: 15px; margin: 20px 0; border-radius: 8px; }
    .feedback-item { background-color: white; border: 1px solid #E5E7EB; padding: 20px; margin: 15px 0; border-radius: 8px; }
    .feedback-item h3 { margin-top: 0; color: #4F46E5; }
    .rating { color: #F59E0B; font-weight: bold; }
    .label { font-weight: bold; color: #6B7280; }
    .value { margin-left: 10px; }
    .timestamp { color: #9CA3AF; font-size: 0.875rem; }
    .footer { text-align: center; color: #9CA3AF; padding: 20px; font-size: 0.875rem; }
    .user-info { background-color: #EEF2FF; padding: 15px; border-radius: 8px; margin-bottom: 15px; }
    .user-info h4 { margin: 0 0 10px 0; color: #4F46E5; font-size: 1.1rem; }
    .user-detail { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Daily Feedback Report</h1>
      <p>${dateStr}</p>
    </div>
    
    <div class="summary">
      <h2>Summary</h2>
      <p><strong>Total Responses:</strong> ${feedbackList.length}</p>
    </div>
`;

    // Add each feedback entry
    feedbackList.forEach((feedback, index) => {
      const timestamp = new Date(feedback.createdAt).toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      });

      // Format education phase for display
      const educationPhaseLabel = feedback.educationPhase
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      html += `
    <div class="feedback-item">
      <h3>Feedback #${index + 1} <span class="timestamp">(${timestamp})</span></h3>
      
      <div class="user-info">
        <h4>👤 User Information</h4>
        <p class="user-detail"><strong>Name:</strong> ${feedback.name}</p>
        <p class="user-detail"><strong>Email:</strong> ${feedback.email}</p>
        <p class="user-detail"><strong>Phone:</strong> ${feedback.phoneNumber}</p>
        <p class="user-detail"><strong>Education Phase:</strong> ${educationPhaseLabel}</p>
      </div>
      
      <h4 style="color: #4F46E5; margin-top: 15px;">📝 Responses</h4>
      <p><span class="label">Q1 - Pre-assessment Ease:</span> <span class="rating">${feedback.q0PreAssessmentEase}/5</span></p>
      <p><span class="label">Q2 - Pre-assessment Understanding:</span> <span class="rating">${feedback.q1PreAssessmentRating}/5</span></p>
      <p><span class="label">Q3 - Study Plan Realistic:</span> <span class="rating">${feedback.q2StudyPlanRating}/5</span></p>
      <p><span class="label">Q4 - MCQ Relevance:</span> <span class="rating">${feedback.q3McqRelevanceRating}/5</span></p>
      <p><span class="label">Q5 - Content Quality vs Current Platform:</span> <span class="value">${feedback.q4ContentQuality}</span></p>
      <p><span class="label">Q6 - Mental State After Use:</span> <span class="value">${feedback.q5MentalState}</span></p>
      <p><span class="label">Q7 - Decision Help:</span> <span class="rating">${feedback.q6DecisionHelpRating}/5</span></p>
      <p><span class="label">Q8 - Switch Potential:</span> <span class="value">${feedback.q7SwitchPotential}</span></p>
      <p><span class="label">Q9 - Trust in Recommendations:</span> <span class="rating">${feedback.q8TrustRating}/5</span></p>
`;

      if (feedback.q9BetterThanCurrent) {
        html += `      <p><span class="label">Q10 - Better Than Current Platform:</span></p>
      <p style="background-color: #F9FAFB; padding: 10px; border-left: 3px solid #4F46E5; margin: 10px 0;">${feedback.q9BetterThanCurrent}</p>
`;
      }

      if (feedback.q10MustImprove) {
        html += `      <p><span class="label">Q11 - Must Improve:</span></p>
      <p style="background-color: #F9FAFB; padding: 10px; border-left: 3px solid #4F46E5; margin: 10px 0;">${feedback.q10MustImprove}</p>
`;
      }

      html += `    </div>
`;
    });

    html += `
    <div class="footer">
      <p>This is an automated report from EduWise Feedback System</p>
      <p>Generated at ${new Date().toLocaleString('en-US')}</p>
    </div>
  </div>
</body>
</html>`;

    return html;
  }

  /**
   * Send email via Amazon SES
   */
  private async sendEmail(
    htmlBody: string,
    feedbackCount: number,
    date: Date,
  ): Promise<void> {
    const dateStr = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const params: AWS.SES.SendEmailRequest = {
      Source: process.env.SES_FROM_EMAIL || 'noreply@example.com',
      Destination: {
        ToAddresses: (process.env.SES_TO_EMAILS || 'admin@example.com').split(
          ',',
        ),
      },
      Message: {
        Subject: {
          Data: `📊 Daily Feedback Report - ${feedbackCount} responses (${dateStr})`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: `Daily Feedback Report for ${dateStr}\n\nTotal Responses: ${feedbackCount}\n\nPlease view this email in HTML format for full details.`,
            Charset: 'UTF-8',
          },
        },
      },
    };

    await this.ses.sendEmail(params).promise();
  }

  /**
   * Manual trigger for testing (optional)
   * Can be called from a controller if you want to test email sending
   */
  async sendTestEmail(): Promise<void> {
    this.logger.log('Sending test email...');
    await this.sendDailyFeedbackReport();
  }
}
