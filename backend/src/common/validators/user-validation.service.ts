import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';

@Injectable()
export class UserValidationService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * Validates if a user ID exists in the database
   * @param userId - The user ID to validate
   * @param fieldName - The field name for error messages
   * @returns Promise<boolean> - true if user exists
   * @throws BadRequestException if user doesn't exist
   */
  async validateUserExists(userId: string, fieldName: string = 'User'): Promise<boolean> {
    if (!userId) return true; // Allow optional fields to be empty
    
    try {
      const user = await this.userModel.findById(new mongoose.Types.ObjectId(userId)).exec();
      if (!user) {
        throw new BadRequestException(`${fieldName} with ID "${userId}" does not exist`);
      }
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(`Invalid ${fieldName} ID format`);
    }
  }

  /**
   * Validates multiple user IDs at once
   * @param userIds - Array of {id: string, fieldName: string} objects
   * @returns Promise<boolean> - true if all users exist
   */
  async validateMultipleUsers(userIds: Array<{id: string, fieldName: string}>): Promise<boolean> {
    const validationPromises = userIds
      .filter(user => user.id) // Only validate non-empty IDs
      .map(user => this.validateUserExists(user.id, user.fieldName));
    
    await Promise.all(validationPromises);
    return true;
  }
} 