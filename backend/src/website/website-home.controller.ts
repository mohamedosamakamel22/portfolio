import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';
import { AlbumsService } from '../albums/albums.service';
import { ReviewsService } from '../reviews/reviews.service';
import { getStat } from '../common/utils/stats.helper';

@ApiTags('Website - Home Page')
@Controller('website/home')
export class WebsiteHomeController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly albumsService: AlbumsService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get home page data (public)',
    description: 'Returns aggregated data for the homepage including profile, limited albums, and stats'
  })
  @ApiQuery({ name: 'albumLimit', required: false, description: 'Number of albums to return (default: 6)' })
  @ApiQuery({ name: 'reviewLimit', required: false, description: 'Number of reviews to return (default: 4)' })
  async getHomePageData(
    @Query('albumLimit', new ParseIntPipe({ optional: true })) albumLimit = 6,
    @Query('reviewLimit', new ParseIntPipe({ optional: true })) reviewLimit = 4,
  ) {
    // Get active profile with basic info
    const profile = await this.profileService.findActive();
    
    // Get limited featured albums for homepage
    const allFeaturedAlbums = await this.albumsService.findFeatured();
    const featuredAlbums = allFeaturedAlbums.slice(0, albumLimit);
    
    // Get limited featured reviews
    const allFeaturedReviews = await this.reviewsService.findFeatured();
    const featuredReviews = allFeaturedReviews.slice(0, reviewLimit);
    
    // Get album stats
    const albumStats = await this.albumsService.getAlbumStats();
    
    // Get review stats
    const reviewStats = await this.reviewsService.getRatingStats();

    return {
      profile: {
        name: profile?.hero ? `${profile.hero.firstName} ${profile.hero.lastName}` : 'Saeed Sekka',
        title: profile?.hero?.aboutMe || 'Professional Photographer',
        bio: profile?.hero?.aboutMe,
        introText: profile?.hero?.aboutMe,
        profileImage: profile?.hero?.profileImage,
        avatar: profile?.hero?.profileImage,
        stats: profile?.stats,
        socialMedia: profile?.socialMedia,
        ctaButtons: profile?.ctaButtons,
        phone: profile?.hero?.phone,
        email: profile?.hero?.phone, // Using phone as email for now
        address: profile?.hero?.address,
        location: profile?.hero?.address,
      },
      services: profile?.services?.services || [],
      experience: profile?.experience?.experience?.slice(0, 4) || [], // Show latest 4 positions
      albums: featuredAlbums,
      reviews: featuredReviews,
      stats: {
        albums: albumStats,
        reviews: reviewStats,
        totalProjects: albumStats?.totalAlbums || 0,
        totalReviews: reviewStats?.totalReviews || 0,
        averageRating: reviewStats?.averageRating || 0,
      },
      meta: {
        albumsShown: featuredAlbums.length,
        totalAlbums: allFeaturedAlbums.length,
        reviewsShown: featuredReviews.length,
        totalReviews: allFeaturedReviews.length,
      }
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get home page statistics (public)' })
  async getStats() {
    const albumStats = await this.albumsService.getAlbumStats();
    const reviewStats = await this.reviewsService.getRatingStats();
    const profile = await this.profileService.findActive();

    return {
      hoursExperience: getStat(profile?.stats?.statsValues, 'hoursExperience', 15000),
      yearsExperience: getStat(profile?.stats?.statsValues, 'yearsExperience', 14),
      awards: getStat(profile?.stats?.statsValues, 'awards', 25),
      happyClients: getStat(profile?.stats?.statsValues, 'happyClients', 200),
      projectsCompleted: getStat(profile?.stats?.statsValues, 'projectsCompleted', albumStats?.totalAlbums || 0),
      totalAlbums: albumStats?.totalAlbums || 0,
      totalReviews: reviewStats?.totalReviews || 0,
      averageRating: reviewStats?.averageRating || 0,
    };
  }
} 