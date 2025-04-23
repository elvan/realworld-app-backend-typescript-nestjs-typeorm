import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { SingleArticleResponse, MultipleArticlesResponse } from './dto/article-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@ApiTags('Articles')
@Controller()
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post('articles')
  @ApiOperation({ summary: 'Create an article' })
  @ApiResponse({
    status: 201,
    description: 'The article has been successfully created.',
    type: SingleArticleResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Body('article') createArticleDto: CreateArticleDto,
    @Request() req: any,
  ): Promise<SingleArticleResponse> {
    return this.articlesService.create(req.user.id, createArticleDto);
  }

  @Get('articles')
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({
    status: 200,
    description: 'Return all articles.',
    type: MultipleArticlesResponse,
  })
  @ApiQuery({ name: 'tag', required: false, type: String })
  @ApiQuery({ name: 'author', required: false, type: String })
  @ApiQuery({ name: 'favorited', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Query() query: ArticleQueryDto,
    @Request() req: any,
  ): Promise<MultipleArticlesResponse> {
    return this.articlesService.findAll(query, req.user?.id);
  }

  @Get('articles/feed')
  @ApiOperation({ summary: 'Get articles from followed users' })
  @ApiResponse({
    status: 200,
    description: 'Return articles from followed users.',
    type: MultipleArticlesResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getFeed(
    @Query() query: FeedQueryDto,
    @Request() req: any,
  ): Promise<MultipleArticlesResponse> {
    return this.articlesService.getFeed(req.user.id, query);
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Get article by slug' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({
    status: 200,
    description: 'Return the article.',
    type: SingleArticleResponse,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(OptionalJwtAuthGuard)
  async findOne(
    @Param('slug') slug: string,
    @Request() req: any,
  ): Promise<SingleArticleResponse> {
    return this.articlesService.findOne(slug, req.user?.id);
  }

  @Put('articles/:slug')
  @ApiOperation({ summary: 'Update article' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully updated.',
    type: SingleArticleResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async update(
    @Param('slug') slug: string,
    @Body('article') updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ): Promise<SingleArticleResponse> {
    return this.articlesService.update(slug, req.user.id, updateArticleDto);
  }

  @Delete('articles/:slug')
  @ApiOperation({ summary: 'Delete article' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({ status: 200, description: 'The article has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    @Param('slug') slug: string,
    @Request() req: any,
  ): Promise<void> {
    return this.articlesService.delete(slug, req.user.id);
  }

  @Post('articles/:slug/favorite')
  @ApiOperation({ summary: 'Favorite an article' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully favorited.',
    type: SingleArticleResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async favorite(
    @Param('slug') slug: string,
    @Request() req: any,
  ): Promise<SingleArticleResponse> {
    return this.articlesService.favorite(slug, req.user.id);
  }

  @Delete('articles/:slug/favorite')
  @ApiOperation({ summary: 'Unfavorite an article' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({
    status: 200,
    description: 'The article has been successfully unfavorited.',
    type: SingleArticleResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unfavorite(
    @Param('slug') slug: string,
    @Request() req: any,
  ): Promise<SingleArticleResponse> {
    return this.articlesService.unfavorite(slug, req.user.id);
  }
}
