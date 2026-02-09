import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback, FeedbackDocument } from './schemas/feedback.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>,
  ) {}

  async create(
    createFeedbackDto: CreateFeedbackDto,
    metadata?: { userAgent?: string; ipAddress?: string; sessionId?: string },
  ): Promise<Feedback> {
    const feedback = new this.feedbackModel({
      ...createFeedbackDto,
      ...metadata,
    });
    return feedback.save();
  }

  async findAll(page = 1, limit = 50): Promise<{
    data: Feedback[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.feedbackModel
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.feedbackModel.countDocuments().exec(),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Feedback> {
    return this.feedbackModel.findById(id).exec();
  }

  async count(): Promise<number> {
    return this.feedbackModel.countDocuments().exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Feedback[]> {
    return this.feedbackModel
      .find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ createdAt: -1 })
      .exec();
  }
}
