import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { Report, ReportDocument } from '../schemas/report.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Album.name) private albumModel: Model<AlbumDocument>,
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Report.name) private reportModel: Model<ReportDocument>,
  ) {}

  async getUserStatistics(userId: string) {
    try {
      // Validate ObjectId format
      if (!userId || !userId.match(/^[0-9a-fA-F]{24}$/)) {
        return {
          userId,
          statistics: {
            reviews: 0,
            albums: 0,
            homeSections: 0,
            reports: 0
          }
        };
      }

      // Fetch all user statistics concurrently using Promise.all
      const [reviewsCount, albumsCount, profile, reportsCount] = await Promise.all([
        this.reviewModel.countDocuments({ userId }).exec(),
        this.albumModel.countDocuments({ userId }).exec(),
        this.profileModel.findOne({ userId }).exec(),
        this.reportModel.countDocuments({ userId }).exec()
      ]);

      // Count active home sections based on profile structure
      let homeSectionsCount = 0;
      if (profile) {
        const sections = [
          'hero',
          'about',
          'stats',
          'bio',
          'brands',
          'experience',
          'services',
          'faq',
          'gear',
          'socialMedia',
          'ctaButtons'
        ];
        
        homeSectionsCount = sections.filter(section => {
          const sectionData = profile[section];
          // Check if section exists and is active (if it has isActive property)
          if (sectionData) {
            return sectionData.isActive !== false; // Consider it active if isActive is not explicitly false
          }
          return false;
        }).length;
      }

      return {
        userId,
        statistics: {
          reviews: reviewsCount,
          albums: albumsCount,
          homeSections: homeSectionsCount,
          reports: reportsCount
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch user statistics: ${error.message}`);
    }
  }

  async getAllUsersStatistics() {
    try {
      // Get all unique user IDs from all collections
      const [reviewUserIds, albumUserIds, profileUserIds, reportUserIds] = await Promise.all([
        this.reviewModel.distinct('userId'),
        this.albumModel.distinct('userId'),
        this.profileModel.distinct('userId'),
        this.reportModel.distinct('userId')
      ]);

      // Combine all user IDs and remove duplicates
      const allUserIds = [...new Set([
        ...reviewUserIds.filter(id => id), // Filter out null/undefined
        ...albumUserIds.filter(id => id),
        ...profileUserIds.filter(id => id),
        ...reportUserIds.filter(id => id)
      ])];

      // Get aggregated statistics for each user
      const statistics = await Promise.all(
        allUserIds.map((userId: any) => this.getUserStatistics(userId.toString()))
      );

      return {
        totalUsers: allUserIds.length,
        statistics
      };
    } catch (error) {
      throw new Error(`Failed to fetch all users statistics: ${error.message}`);
    }
  }

} 