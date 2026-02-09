import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { FeedbackModule } from './feedback/feedback.module';
import { EmailModule } from './email/email.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduwise_feedback'),
    FeedbackModule,
    EmailModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
