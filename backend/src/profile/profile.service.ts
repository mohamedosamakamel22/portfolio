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
    return this.profileModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    return profile;
  }

  async findActive(): Promise<Profile | null> {
    return this.profileModel.findOne({ isActive: true }).exec();
  }

  // Portfolio-based methods
  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileModel
      .findOne({
        userId: userId,
        isActive: true
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
    await profile.set(updateProfileDto).save();
    return profile
  }

  async remove(id: string): Promise<void> {
    const result = await this.profileModel.findOneAndDelete({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!result) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
  }

  async deactivate(id: string): Promise<Profile> {
    return this.update(id, { isActive: false });
  }

  async activate(id: string): Promise<Profile> {
    return this.update(id, { isActive: true });
  }

  async updateStats(id: string, stats: any): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    profile.stats = stats;
    return profile.save();
  }

  async addExperience(id: string, experience: any): Promise<Profile> {
    const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    profile.experience = profile.experience || [];
    profile.experience.push(experience);
    return profile.save();
  }

  async removeExperience(id: string, experienceIndex: number): Promise<Profile> {
        const profile = await this.profileModel.findOne({ userId: new mongoose.Types.ObjectId(id) }).exec();
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    if (profile.experience && profile.experience.length > experienceIndex) {
      profile.experience.splice(experienceIndex, 1);
      return profile.save();
    }
    throw new NotFoundException('Experience not found');
  }
} 