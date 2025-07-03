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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() createReviewDto: CreateReviewDto, @CurrentUser() user: any) {
    return this.reviewsService.create(createReviewDto, createReviewDto.clientUserId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Query('visible') visible?: string) {
    if (visible === 'true') {
      return this.reviewsService.findVisibleByUser(userId);
    }
    return this.reviewsService.findByUser(userId);
  }

  @Get()
  findAll(@Query('visible') visible?: string) {
    if (visible === 'true') {
      return this.reviewsService.findVisible();
    }
    return this.reviewsService.findAll();
  }

  @Get('featured')
  findFeatured() {
    return this.reviewsService.findFeatured();
  }

  @Get('stats/rating')
  getAverageRating() {
    return this.reviewsService.getAverageRating();
  }

  @Get('stats/distribution')
  getRatingStats() {
    return this.reviewsService.getRatingStats();
  }

  @Get('by-rating/:rating')
  findByRating(@Param('rating') rating: string) {
    return this.reviewsService.findByRating(parseInt(rating));
  }

  @Get('by-service/:service')
  findByService(@Param('service') service: string) {
    return this.reviewsService.findByService(service);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

  @Patch(':id/toggle-visibility')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  toggleVisibility(@Param('id') id: string) {
    return this.reviewsService.toggleVisibility(id);
  }

  @Patch(':id/toggle-featured')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  toggleFeatured(@Param('id') id: string) {
    return this.reviewsService.toggleFeatured(id);
  }

  @Post(':id/upload-avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, 'avatars');
      
      // Update review with new avatar URL
      const updatedReview = await this.reviewsService.update(id, {
        avatar: result.secure_url,
      });

      return {
        message: 'Avatar uploaded successfully',
        imageUrl: result.secure_url,
        review: updatedReview,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload avatar');
    }
  }
} 