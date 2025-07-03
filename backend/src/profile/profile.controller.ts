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
import { ApiTags, ApiBearerAuth, ApiProperty, ApiConsumes, ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateProfileDto, ProfileResponseDto } from './dto/create-profile.dto';
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
  @ApiOperation({
    summary: 'Create a new profile',
    description: 'Create a complete new profile with all sections. Only admin users can perform this operation. All sections are required for a complete profile.',
    tags: ['Profile Management']
  })
  @ApiBody({
    type: CreateProfileDto,
    description: 'Complete profile data with all required sections',
    examples: {
      'Complete Profile': {
        summary: 'Create a complete photographer profile',
        description: 'Example of a full profile with all sections populated',
        value: {
          userId: '507f1f77bcf86cd799439011',
          hero: {
            firstName: 'Saeed',
            lastName: 'Sekka',
            phone: '+966-53-868-3923',
            address: 'Riyadh, Saudi Arabia',
            profileImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg',
            coverImage: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/cover/saeed-cover.jpg',
            aboutMe: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
            isActive: true,
            specialties: ['Photography', 'Photo Editing', 'Designer']
          },
          youtubeVideo: {
            videoId: 'dQw4w9WgXcQ',
            title: 'My Photography Journey',
            description: 'A glimpse into my photography journey and creative process',
            thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
            embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
          },
          stats: {
            title: 'My Achievements',
            subtitle: 'Numbers that tell my story',
            statsValues: [
              { title: 'Years of Experience', subtitle: 'Professional Journey', key: 'yearsExperience', value: 14, order: 1 },
              { title: 'Projects Completed', subtitle: 'Success Stories', key: 'projectsCompleted', value: 500, order: 2 },
              { title: 'Happy Clients', subtitle: 'Satisfied Customers', key: 'happyClients', value: 200, order: 3 }
            ],
            isActive: true
          },
          bio: {
            title: 'About Me',
            description: 'I am a passionate photographer dedicated to capturing life\'s most precious moments.',
            isActive: true,
            button: { text: 'Read More', url: '/about', enabled: true }
          },
          brands: {
            title: 'Brands I Work With',
            subtitle: 'Trusted by leading brands',
            brands: [
              { name: 'Canon', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/canon-logo.jpg', order: 1 },
              { name: 'Adobe', logo: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/brands/adobe-logo.jpg', order: 2 }
            ],
            isActive: true
          },
          experience: {
            title: 'My Experience',
            subtitle: 'Professional journey and achievements',
            experience: [
              {
                company: 'Clavmen Studio',
                position: 'Senior UX Designer',
                startDate: '2022-01-01',
                endDate: null,
                isPresent: true,
                description: 'Clavmen inspires creativity and makes learning piano fun.',
                order: 1
              }
            ],
            isActive: true
          },
          services: {
            title: 'My Services',
            subtitle: 'What I offer',
            services: [
              { title: 'Portrait Photography', description: 'Professional portrait sessions for individuals and families', order: 1 },
              { title: 'Event Photography', description: 'Capturing special moments at events', order: 2 }
            ],
            isActive: true
          },
          faq: {
            title: 'Frequently Asked Questions',
            subtitle: 'Common questions answered',
            faq: [
              {
                question: 'How do I book a photography session?',
                answer: 'You can book a session by filling out the contact form on my website.',
                order: 1
              }
            ],
            isActive: true
          },
          socialMedia: {
            isActive: true,
            socialMedia: [
              { icon: 'fab fa-instagram', url: 'https://instagram.com/saeedsekka', title: 'Instagram', order: 1 },
              { icon: 'fab fa-facebook', url: 'https://facebook.com/saeedsekka', title: 'Facebook', order: 2 },
              { icon: 'fab fa-twitter', url: 'https://twitter.com/saeed_sekka', title: 'Twitter', order: 3 },
              { icon: 'fab fa-linkedin', url: 'https://linkedin.com/in/saeed-sekka', title: 'LinkedIn', order: 4 }
            ]
          },
          ctaButtons: {
            primary: { text: 'Book Now', url: '/contact', type: 'primary' },
            secondary: { text: 'View Portfolio', url: '/portfolio', type: 'secondary' },
            whatsapp: { text: 'WhatsApp', url: 'https://wa.me/966538683923', type: 'whatsapp' },
            call: { text: 'Call Now', url: 'tel:+966538683923', type: 'call' }
          }
        }
      },
      'Minimal Profile': {
        summary: 'Create a minimal profile with required fields only',
        description: 'Example with only the hero section (required) and basic optional sections',
        value: {
          hero: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-123-4567',
            address: 'New York, USA',
            profileImage: 'https://example.com/profile.jpg',
            coverImage: 'https://example.com/cover.jpg',
            aboutMe: 'A passionate professional in my field.',
            isActive: true,
            specialties: ['Professional Service']
          },
          bio: {
            title: 'About Me',
            description: 'A passionate professional in my field.',
            isActive: true,
            button: { text: 'Learn More', url: '/about', enabled: true }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Profile created successfully',
    type: ProfileResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['hero.firstName should not be empty', 'hero.lastName should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Profile already exists for this user',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Profile already exists for this user' }
      }
    }
  })
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }





  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by ID',
    description: 'Retrieve a specific profile by its ID',
    tags: ['Profile Management']
  })
  @ApiParam({
    name: 'id',
    description: 'Profile ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ProfileResponseDto
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Profile not found' }
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update profile information',
    description: 'Update an existing profile with new information. Only admin users can perform this operation. All fields are optional and will only update the provided fields.',
    tags: ['Profile Management']
  })
  @ApiParam({
    name: 'id',
    description: 'Profile ID (MongoDB ObjectId)',
    example: '507f1f77bcf86cd799439011',
    type: 'string'
  })
  @ApiBody({
    type: UpdateProfileDto,
    description: 'Profile update data - all fields are optional',
    examples: {
      'Update Hero Section': {
        summary: 'Update hero section information',
        description: 'Update the hero section with new personal information',
        value: {
          hero: {
            firstName: 'Updated Name',
            lastName: 'Updated Last Name',
            phone: '+966-53-868-3924',
            address: 'Updated Address, Saudi Arabia',
            aboutMe: 'Updated about me text with new information.',
            specialties: ['Updated Specialty 1', 'Updated Specialty 2']
          }
        }
      },
      'Update Stats': {
        summary: 'Update statistics section',
        description: 'Update the statistics with new values',
        value: {
          stats: {
            title: 'Updated Achievements',
            subtitle: 'Updated subtitle',
            statsValues: [
              {
                title: 'Years of Experience',
                subtitle: 'Professional Journey',
                key: 'yearsExperience',
                value: 15,
                order: 1
              },
              {
                title: 'Projects Completed',
                subtitle: 'Success Stories',
                key: 'projectsCompleted',
                value: 600,
                order: 2
              }
            ],
            isActive: true
          }
        }
      },
      'Update Experience': {
        summary: 'Update experience section',
        description: 'Add or update work experience information',
        value: {
          experience: {
            title: 'My Updated Experience',
            subtitle: 'Updated professional journey',
            experience: [
              {
                company: 'Updated Company',
                position: 'Updated Position',
                startDate: '2023-01-01',
                endDate: null,
                isPresent: true,
                description: 'Updated job description and responsibilities.',
                order: 1
              }
            ],
            isActive: true
          }
        }
      },
      'Update Social Media': {
        summary: 'Update social media links',
        description: 'Update social media profiles and handles',
        value: {
          socialMedia: {
            isActive: true,
            socialMedia: [
              { icon: 'fab fa-instagram', url: 'https://instagram.com/updatedhandle', title: 'Instagram', order: 1 },
              { icon: 'fab fa-facebook', url: 'https://facebook.com/updatedhandle', title: 'Facebook', order: 2 },
              { icon: 'fab fa-twitter', url: 'https://twitter.com/updatedhandle', title: 'Twitter', order: 3 }
            ]
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: ProfileResponseDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['firstName should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User does not have admin role',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Forbidden resource' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Profile not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Profile not found' }
      }
    }
  })
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
      
      // Get the current profile
      const profile = await this.profileService.findOne(id);
      
      // Update the profile image in the hero section
      if (profile.hero) {
        profile.hero.profileImage = result.secure_url;
        await profile.save();
      }

      return {
        message: 'Profile image uploaded successfully',
        imageUrl: result.secure_url,
        profile: profile,
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
    return this.profileService.updateStats(id, updateStatsDto);
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