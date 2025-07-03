import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReviewsService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { UpdateReviewDto } from '../reviews/dto/update-review.dto';
import { CmsCreateReviewDto } from './dto/cms-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('CMS - Reviews Management')
@Controller('cms/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class CmsReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create review (Admin)',
    description: 'Admin can create reviews and optionally specify the client user ID'
  })
  create(@Body() createReviewDto: CmsCreateReviewDto, @CurrentUser() user: any) {
    // If clientUserId is specified in the DTO, use it; otherwise use the admin's ID
    const clientUserId = createReviewDto.clientUserId || user.userId;
    return this.reviewsService.createAdminReview(createReviewDto, clientUserId);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.reviewsService.findByUser(userId);
  }

  @Get('stats')
  getStats() {
    return this.reviewsService.getRatingStats();
  }

  @Get('stats/user/:userId')
  getStatsByUser(@Param('userId') userId: string) {
    return this.reviewsService.getRatingStatsByPortfolio(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }

  @Patch(':id/toggle-visibility')
  toggleVisibility(@Param('id') id: string) {
    return this.reviewsService.toggleVisibility(id);
  }

  @Patch(':id/toggle-featured')
  toggleFeatured(@Param('id') id: string) {
    return this.reviewsService.toggleFeatured(id);
  }
} 