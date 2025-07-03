import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Profile, ProfileDocument } from '../schemas/profile.schema';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserValidationService } from '../common/validators/user-validation.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    private userValidationService: UserValidationService,
  ) { }

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Validate user ID if provided
    if (createProfileDto.userId) {
      await this.userValidationService.validateUserExists(createProfileDto.userId, 'Profile user');

      const profile = await this.profileModel.findOne({ userId: createProfileDto.userId }).exec();
      if (profile) {
        throw new BadRequestException('Profile already exists for this user');
      }
    }

    const createdProfile = new this.profileModel(createProfileDto);
    return createdProfile.save();
  }

  async findAll(): Promise<Profile[]> {
    // Find profiles where hero section is active
    return this.profileModel.find({ 'hero.isActive': true }).exec();
  }

  async findOne(id: string): Promise<ProfileDocument> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findActive(): Promise<Profile | null> {
    // Find profile where hero section is active
    return this.profileModel.findOne({ 'hero.isActive': true }).exec();
  }

  // Portfolio-based methods
  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel
      .findOne({
        userId: userId,
        'hero.isActive': true
      })
      .exec();
  }

  async findOneByPortfolio(id: string, portfolioId: string): Promise<Profile> {
    const profile = await this.profileModel
      .findOne({
        _id: id,
        userId: portfolioId
      })
      .exec();

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found for this portfolio`);
    }
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<Profile> {
    // Validate user ID if being updated
    if (updateProfileDto.userId) {
      await this.userValidationService.validateUserExists(updateProfileDto.userId, 'Profile user');
    }
    const profile = await this.profileModel
      .findOne({ userId: new mongoose.Types.ObjectId(id) })
      .exec();

    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }

    // Handle nested object updates properly
    const updateData = { ...updateProfileDto };
    
    // If updating hero section partially, merge with existing data
    if (updateData.hero && profile.hero) {
      updateData.hero = { ...profile.hero, ...updateData.hero };
    }
    
    // If updating stats section partially, merge with existing data
    if (updateData.stats && profile.stats) {
      updateData.stats = { ...profile.stats, ...updateData.stats };
    }
    
    // If updating bio section partially, merge with existing data
    if (updateData.bio && profile.bio) {
      updateData.bio = { ...profile.bio, ...updateData.bio };
    }
    
    // If updating brands section partially, merge with existing data
    if (updateData.brands && profile.brands) {
      updateData.brands = { ...profile.brands, ...updateData.brands };
    }
    
    // If updating experience section partially, merge with existing data
    if (updateData.experience && profile.experience) {
      updateData.experience = { ...profile.experience, ...updateData.experience };
    }
    
    // If updating services section partially, merge with existing data
    if (updateData.services && profile.services) {
      updateData.services = { ...profile.services, ...updateData.services };
    }
    
    // If updating faq section partially, merge with existing data
    if (updateData.faq && profile.faq) {
      updateData.faq = { ...profile.faq, ...updateData.faq };
    }
    
    // If updating socialMedia section partially, merge with existing data
    if (updateData.socialMedia && profile.socialMedia) {
      updateData.socialMedia = { ...profile.socialMedia, ...updateData.socialMedia };
    }
    
    // If updating ctaButtons section partially, merge with existing data
    if (updateData.ctaButtons && profile.ctaButtons) {
      updateData.ctaButtons = { ...profile.ctaButtons, ...updateData.ctaButtons };
    }

    await profile.set(updateData).save();
    return profile;
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileModel.findOneAndDelete({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!result) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }

  async deactivate(id: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    // Deactivate the hero section
    if (profile.hero) {
      profile.hero.isActive = false;
    }
    
    return profile.save();
  }

  async activate(id: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    // Activate the hero section
    if (profile.hero) {
      profile.hero.isActive = true;
    }
    
    return profile.save();
  }

  async updateStats(id: string, updateStatsDto: any): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    // Merge existing stats with updates
    const updatedStats = {
      ...profile.stats,
      ...updateStatsDto
    };
    
    profile.stats = updatedStats;
    return profile.save();
  }

  async addExperience(id: string, experience: any): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    // Initialize experience section if it doesn't exist
    if (!profile.experience) {
      profile.experience = {
        title: 'My Experience',
        subtitle: 'Professional journey and achievements',
        experience: [],
        isActive: true
      };
    }
    
    // Add the new experience to the experience array
    profile.experience.experience.push(experience);
    return profile.save();
  }

  async removeExperience(id: string, experienceIndex: number): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    if (profile.experience && profile.experience.experience && profile.experience.experience.length > experienceIndex) {
      profile.experience.experience.splice(experienceIndex, 1);
      return profile.save();
    }
    throw new NotFoundException('Experience not found');
  }
} 