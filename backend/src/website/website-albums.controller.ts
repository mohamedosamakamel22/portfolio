import { Controller, Get, Param, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { AlbumsService } from '../albums/albums.service';

@ApiTags('Website - Public Albums')
@Controller('website/:portfolioId/albums')
export class WebsiteAlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all published albums for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of albums to return' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'projectType', required: false, description: 'Filter by project type' })
  async findPublished(
    @Param('portfolioId') portfolioId: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('category') category?: string,
    @Query('projectType') projectType?: string,
  ) {
    let albums;
    
    if (category) {
      albums = await this.albumsService.findByCategoryAndPortfolio(category, portfolioId);
    } else if (projectType) {
      albums = await this.albumsService.findByProjectTypeAndPortfolio(projectType, portfolioId);
    } else {
      albums = await this.albumsService.findPublishedByPortfolio(portfolioId);
    }
    
    if (limit && limit > 0) {
      albums = albums.slice(0, limit);
    }
    
    return {
      albums,
      meta: {
        portfolioId,
        totalShown: albums.length,
        filters: {
          category: category || null,
          projectType: projectType || null,
          limit: limit || null
        }
      }
    };
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured albums for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  findFeatured(@Param('portfolioId') portfolioId: string) {
    return this.albumsService.findFeaturedByPortfolio(portfolioId);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all album categories for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  getCategories(@Param('portfolioId') portfolioId: string) {
    return this.albumsService.getCategoriesByPortfolio(portfolioId);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Get all tags for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  getTags(@Param('portfolioId') portfolioId: string) {
    return this.albumsService.getTagsByPortfolio(portfolioId);
  }

  @Get('filter-by-tags')
  @ApiOperation({ summary: 'Filter albums by tags for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiQuery({ name: 'tags', description: 'Comma-separated list of tags to filter by' })
  findByTags(@Param('portfolioId') portfolioId: string, @Query('tags') tags: string) {
    if (!tags) {
      throw new BadRequestException('Tags query parameter is required');
    }
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.albumsService.findByTagsAndPortfolio(tagArray, portfolioId);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search albums for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  search(
    @Param('portfolioId') portfolioId: string,
    @Query('q') query: string
  ) {
    return this.albumsService.searchAlbumsByPortfolio(query, portfolioId);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get albums by category for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiParam({ name: 'category', description: 'Album category' })
  findByCategory(
    @Param('portfolioId') portfolioId: string,
    @Param('category') category: string
  ) {
    return this.albumsService.findByCategoryAndPortfolio(category, portfolioId);
  }

  @Get('project-type/:projectType')
  @ApiOperation({ summary: 'Get albums by project type for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiParam({ name: 'projectType', description: 'Project type' })
  findByProjectType(
    @Param('portfolioId') portfolioId: string,
    @Param('projectType') projectType: string
  ) {
    return this.albumsService.findByProjectTypeAndPortfolio(projectType, portfolioId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get album by ID for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiParam({ name: 'id', description: 'Album ID' })
  @ApiQuery({ name: 'includeRelated', required: false, description: 'Include related albums' })
  @ApiQuery({ name: 'relatedLimit', required: false, description: 'Number of related albums to return (default: 4)' })
  async findOne(
    @Param('portfolioId') portfolioId: string,
    @Param('id') id: string,
    @Query('includeRelated') includeRelated?: string,
    @Query('relatedLimit', new ParseIntPipe({ optional: true })) relatedLimit = 4,
  ) {
    const album = await this.albumsService.findOneByPortfolio(id, portfolioId);
    
    if (includeRelated === 'true') {
      // Get related albums (same category, excluding current album, same portfolio)
      const relatedAlbums = await this.albumsService.findByCategoryAndPortfolio(album.category, portfolioId);
      const filteredRelated = relatedAlbums
        .filter(related => (related as any)._id.toString() !== id)
        .slice(0, relatedLimit);
      
      return {
        album,
        relatedAlbums: filteredRelated,
        relatedCount: filteredRelated.length,
        portfolioId
      };
    }
    
    return {
      album,
      portfolioId
    };
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'Get related albums by album ID for portfolio (public)' })
  @ApiParam({ name: 'portfolioId', description: 'Portfolio user ID' })
  @ApiParam({ name: 'id', description: 'Album ID' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of related albums to return (default: 4)' })
  async getRelated(
    @Param('portfolioId') portfolioId: string,
    @Param('id') id: string,
    @Query('limit', new ParseIntPipe({ optional: true })) limit = 4,
  ) {
    const album = await this.albumsService.findOneByPortfolio(id, portfolioId);
    const relatedAlbums = await this.albumsService.findByCategoryAndPortfolio(album.category, portfolioId);
    
    return relatedAlbums
      .filter(related => (related as any)._id.toString() !== id)
      .slice(0, limit);
  }
} 