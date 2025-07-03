import { Controller, Get, Query, ParseIntPipe, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ReviewsService } from '../reviews/reviews.service';

@ApiTags('Website - Public Reviews')
@Controller('website/:portfolioId/reviews')
export class WebsiteReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get reviews page data (public)',
    description: 'Returns all visible reviews for a specific portfolio with pagination and filtering options'
  })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of reviews to return' })
  @ApiQuery({ name: 'featured', required: false, description: 'Only featured reviews (true/false)' })
  @ApiQuery({ name: 'rating', required: false, description: 'Filter by minimum rating (1-5)' })
  async getReviewsPageData(
    @Param('portfolioId') portfolioId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('featured') featured?: string,
    @Query('rating', new ParseIntPipe({ optional: true })) rating?: number,
  ) {
    let reviews;
    
    if (featured === 'true') {
      reviews = await this.reviewsService.findFeaturedByPortfolio(portfolioId);
    } else {
      reviews = await this.reviewsService.findVisibleByPortfolio(portfolioId);
    }
    
    // Filter by rating if specified
    if (rating && rating >= 1 && rating <= 5) {
      reviews = reviews.filter(review => review.rating >= rating);
    }
    
    // Apply limit if specified
    if (limit && limit > 0) {
      reviews = reviews.slice(0, limit);
    }
    
    // Get statistics for this portfolio
    const stats = await this.reviewsService.getRatingStatsByPortfolio(portfolioId);
    
    return {
      reviews,
      stats,
      meta: {
        portfolioId,
        totalShown: reviews.length,
        filters: {
          featured: featured === 'true',
          minimumRating: rating || null,
          limit: limit || null
        }
      }
    };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured reviews for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  findFeatured(@Param('portfolioId') portfolioId: string) {
    return this.reviewsService.findFeaturedByPortfolio(portfolioId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get rating statistics for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  getStats(@Param('portfolioId') portfolioId: string) {
    return this.reviewsService.getRatingStatsByPortfolio(portfolioId);
  }
} 