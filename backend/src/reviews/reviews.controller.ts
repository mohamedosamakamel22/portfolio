import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  Put,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { Review } from 'src/schemas/review.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Number of reviews per page' })
  @ApiQuery({ name: 'page', type: Number, required: false, description: 'Page number' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully', type: [Review] })
  findAll(@Query('limit') limit: number = 10, @Query('page') page: number = 1) {
    return this.reviewsService.findAll(limit, page);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Review ID to update' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: Review })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Review ID to delete' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async remove(@Param('id') id: string) {
    await this.reviewsService.remove(id);
    return { message: 'Review deleted successfully' };
  }

} 