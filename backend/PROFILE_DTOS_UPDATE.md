# Profile DTOs Update - New Body DTOs Added

## 📋 Overview

Added proper DTOs for profile controller endpoints that were previously using `any` type for body parameters. This ensures proper validation, Swagger documentation, and type safety.

## 🆕 New DTOs Created

### 1. **UpdateStatsDto** (`backend/src/profile/dto/update-stats.dto.ts`)

**Purpose**: Validates and documents the body for updating profile statistics.

**Usage**: `PATCH /profile/:id/stats`

**Structure**:
```typescript
export class UpdateStatsDto {
  @ApiProperty({
    example: [
      { key: 'yearsExperience', value: 14 },
      { key: 'projectsCompleted', value: 500 },
      { key: 'happyClients', value: 200 },
      { key: 'awards', value: 25 },
      { key: 'hoursExperience', value: 15000 }
    ],
    description: 'Array of statistics to update'
  })
  stats: StatDto[];
}
```

**Example Request Body**:
```json
{
  "stats": [
    { "key": "yearsExperience", "value": 14 },
    { "key": "projectsCompleted", "value": 500 },
    { "key": "happyClients", "value": 200 },
    { "key": "awards", "value": 25 },
    { "key": "hoursExperience", "value": 15000 }
  ]
}
```

**Validation**:
- ✅ Array validation
- ✅ Nested object validation
- ✅ String/number value validation
- ✅ Required fields validation

### 2. **AddExperienceDto** (`backend/src/profile/dto/add-experience.dto.ts`)

**Purpose**: Validates and documents the body for adding new experience entries.

**Usage**: `POST /profile/:id/experience`

**Structure**:
```typescript
export class AddExperienceDto {
  @ApiProperty({ example: 'Clavmen Studio' })
  company: string;

  @ApiProperty({ example: 'Senior UX Designer' })
  position: string;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ example: null, required: false })
  endDate?: Date;

  @ApiProperty({ example: true, required: false })
  isPresent?: boolean;

  @ApiProperty({ example: 'Riyadh, Saudi Arabia', required: false })
  location?: string;

  @ApiProperty({ example: 'Full-time', required: false })
  employmentType?: string;

  @ApiProperty({ example: 'Clavmen inspires creativity...' })
  description: string;

  @ApiProperty({ 
    example: [
      'Led UX design for innovative piano learning platform',
      'Improved user engagement by 40%'
    ],
    required: false 
  })
  achievements?: string[];
}
```

**Example Request Body**:
```json
{
  "company": "Clavmen Studio",
  "position": "Senior UX Designer",
  "startDate": "2022-01-01T00:00:00.000Z",
  "isPresent": true,
  "location": "Riyadh, Saudi Arabia",
  "employmentType": "Full-time",
  "description": "Clavmen inspires creativity and makes learning piano fun. The sleek, lightweight body fits easily into gig bags for portability.",
  "achievements": [
    "Led UX design for innovative piano learning platform",
    "Improved user engagement by 40%",
    "Designed portable and user-friendly interfaces",
    "Collaborated with cross-functional teams"
  ]
}
```

**Validation**:
- ✅ Required fields validation
- ✅ Date transformation and validation
- ✅ Optional fields handling
- ✅ Array validation for achievements

### 3. **UploadImageResponseDto** (`backend/src/profile/dto/upload-image.dto.ts`)

**Purpose**: Documents the response structure for profile image uploads.

**Usage**: `POST /profile/:id/upload-profile-image`

**Structure**:
```typescript
export class UploadImageResponseDto {
  @ApiProperty({
    example: 'Profile image uploaded successfully'
  })
  message: string;

  @ApiProperty({
    example: 'https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg'
  })
  imageUrl: string;

  @ApiProperty({
    description: 'Updated profile object'
  })
  profile: any;
}
```

**Example Response**:
```json
{
  "message": "Profile image uploaded successfully",
  "imageUrl": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg",
  "profile": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Saeed Sekka",
    "profileImage": "https://res.cloudinary.com/egyptismycountry/image/upload/v1/portfolio/profile/saeed-main.jpg",
    // ... other profile fields
  }
}
```

## 🔧 Controller Updates

### Profile Controller Changes

**File**: `backend/src/profile/profile.controller.ts`

**Updated Endpoints**:

1. **Update Stats Endpoint**:
```typescript
@Patch(':id/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
updateStats(@Param('id') id: string, @Body() updateStatsDto: UpdateStatsDto) {
  return this.profileService.updateStats(id, updateStatsDto.stats);
}
```

2. **Add Experience Endpoint**:
```typescript
@Post(':id/experience')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
addExperience(@Param('id') id: string, @Body() addExperienceDto: AddExperienceDto) {
  return this.profileService.addExperience(id, addExperienceDto);
}
```

3. **Upload Image Endpoint**:
```typescript
@Post(':id/upload-profile-image')
@UseInterceptors(FileInterceptor('image'))
@ApiBearerAuth()
@ApiConsumes('multipart/form-data')
async uploadProfileImage(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
) {
  // ... implementation
}
```

## 🎯 Key Features

### 1. **Type Safety**
- ✅ Replaced `any` types with proper DTOs
- ✅ Compile-time type checking
- ✅ IntelliSense support

### 2. **Validation**
- ✅ Automatic request validation
- ✅ Custom validators for complex types
- ✅ Date transformation and validation
- ✅ Array and nested object validation

### 3. **Swagger Documentation**
- ✅ Comprehensive API documentation
- ✅ Realistic examples from Saeed Sekka portfolio
- ✅ Proper parameter descriptions
- ✅ Response structure documentation

### 4. **Consistency**
- ✅ Follows existing DTO patterns
- ✅ Uses same validation decorators
- ✅ Consistent with other API endpoints

## 📊 Validation Rules

### UpdateStatsDto
- `stats`: Required array of StatDto objects
- `key`: Required string (statistic identifier)
- `value`: Required string or number (statistic value)

### AddExperienceDto
- `company`: Required string
- `position`: Required string
- `startDate`: Required valid date
- `endDate`: Optional valid date
- `isPresent`: Optional boolean
- `location`: Optional string
- `employmentType`: Optional string
- `description`: Required string
- `achievements`: Optional array of strings

## 🔗 Integration

### Import Statements Added
```typescript
import { UpdateStatsDto } from './dto/update-stats.dto';
import { AddExperienceDto } from './dto/add-experience.dto';
import { UploadImageResponseDto } from './dto/upload-image.dto';
```

### Swagger Imports Added
```typescript
import { ApiTags, ApiBearerAuth, ApiProperty, ApiConsumes } from '@nestjs/swagger';
```

## ✅ Benefits

1. **Type Safety**: Eliminates `any` types and provides compile-time checking
2. **Validation**: Automatic request validation with meaningful error messages
3. **Documentation**: Comprehensive Swagger documentation with realistic examples
4. **Developer Experience**: Better IntelliSense and IDE support
5. **Consistency**: Follows established patterns in the codebase
6. **Maintainability**: Clear structure and validation rules

## 🚀 Usage Examples

### Update Profile Statistics
```bash
curl -X PATCH "http://localhost:3000/profile/507f1f77bcf86cd799439011/stats" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stats": [
      {"key": "yearsExperience", "value": 14},
      {"key": "projectsCompleted", "value": 500}
    ]
  }'
```

### Add New Experience
```bash
curl -X POST "http://localhost:3000/profile/507f1f77bcf86cd799439011/experience" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Clavmen Studio",
    "position": "Senior UX Designer",
    "startDate": "2022-01-01T00:00:00.000Z",
    "isPresent": true,
    "location": "Riyadh, Saudi Arabia",
    "description": "Led UX design for innovative piano learning platform"
  }'
```

### Upload Profile Image
```bash
curl -X POST "http://localhost:3000/profile/507f1f77bcf86cd799439011/upload-profile-image" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@profile-photo.jpg"
```

## 🎉 Result

All profile controller endpoints now have:
- ✅ Proper DTOs with validation
- ✅ Comprehensive Swagger documentation
- ✅ Type safety and IntelliSense support
- ✅ Realistic examples from the Saeed Sekka portfolio
- ✅ Consistent API structure

The API is now more robust, well-documented, and developer-friendly!
