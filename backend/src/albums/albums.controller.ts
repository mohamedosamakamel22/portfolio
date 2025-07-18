import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AlbumsService } from './albums.service';
import { DigitalOceanSpacesService } from '../digitalocean-spaces/digitalocean-spaces.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../schemas/user.schema';
import { FilterByTagDto } from './dto/filter-by-tag.dto';

@ApiTags('Albums')
@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly digitalOceanSpacesService: DigitalOceanSpacesService,
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  create(@Body() createAlbumDto: CreateAlbumDto, @CurrentUser() user: any) {
    return this.albumsService.create(createAlbumDto, user.createdBy);
  }
  @Get('filter-by-tags')
  findByTags(@Query() filterByTagDto: FilterByTagDto) {
    const pageNum = filterByTagDto.page || 1;
    const limitNum = filterByTagDto.limit || 10;
    const tags = filterByTagDto.tags || [];

    if (pageNum <= 0 || limitNum <= 0) {
      throw new BadRequestException('Page and limit must be positive numbers');
    }

    const tagArray = tags;
    return this.albumsService.findWithFiltersAndPagination(tagArray, pageNum, limitNum);
  }

  @Get('tags')
  getAllTags() {
    return this.albumsService.getAllTags();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.albumsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.albumsService.remove(id);
  }



} 