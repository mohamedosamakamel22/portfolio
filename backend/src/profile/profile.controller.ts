import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiProperty, ApiConsumes } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateStatsDto } from './dto/update-stats.dto';
import { AddExperienceDto } from './dto/add-experience.dto';
import { UploadImageResponseDto } from './dto/upload-image.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }





  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.profileService.remove(id);
  }



  @Post(':id/upload-profile-image')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  async uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      const result = await this.cloudinaryService.uploadImage(file, 'profile');
      
      // Update profile with new image URL
      const updatedProfile = await this.profileService.update(id, {
        profileImage: result.secure_url,
      });

      return {
        message: 'Profile image uploaded successfully',
        imageUrl: result.secure_url,
        profile: updatedProfile,
      };
    } catch (error) {
      throw new BadRequestException('Failed to upload image');
    }
  }

  @Patch(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  updateStats(@Param('id') id: string, @Body() updateStatsDto: UpdateStatsDto) {
    return this.profileService.updateStats(id, updateStatsDto.stats);
  }

  @Post(':id/experience')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  addExperience(@Param('id') id: string, @Body() addExperienceDto: AddExperienceDto) {
    return this.profileService.addExperience(id, addExperienceDto);
  }

  @Delete(':id/experience/:index')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  removeExperience(
    @Param('id') id: string,
    @Param('index') index: string,
  ) {
    return this.profileService.removeExperience(id, parseInt(index));
  }
} 