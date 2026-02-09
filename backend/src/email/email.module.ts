import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
  imports: [FeedbackModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
