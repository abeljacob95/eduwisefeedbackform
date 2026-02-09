import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Query,
  Req,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('api/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto, @Req() req: Request) {
    try {
      const metadata = {
        userAgent: req.get('user-agent'),
        ipAddress: req.ip || req.socket.remoteAddress,
        sessionId: req.get('x-session-id'),
      };

      const feedback = await this.feedbackService.create(createFeedbackDto, metadata);

      return {
        success: true,
        message: 'Feedback submitted successfully',
        id: (feedback as any)._id,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Failed to submit feedback',
          details: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '50',
  ) {
    try {
      const result = await this.feedbackService.findAll(
        parseInt(page),
        parseInt(limit),
      );

      return {
        success: true,
        ...result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          error: 'Failed to fetch feedback',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const feedback = await this.feedbackService.findOne(id);

      if (!feedback) {
        throw new HttpException(
          {
            success: false,
            error: 'Feedback not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: feedback,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          error: 'Failed to fetch feedback',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
