import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SingleCommentResponse, MultipleCommentsResponse } from './dto/comment-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@ApiTags('Comments')
@Controller('articles/:slug/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment for an article' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: SingleCommentResponse,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async create(
    @Param('slug') slug: string,
    @Body('comment') createCommentDto: CreateCommentDto,
    @Request() req: any,
  ): Promise<SingleCommentResponse> {
    return this.commentsService.create(slug, req.user.id, createCommentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments for an article' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiResponse({
    status: 200,
    description: 'Return all comments for the article.',
    type: MultipleCommentsResponse,
  })
  @ApiResponse({ status: 404, description: 'Article not found' })
  @UseGuards(OptionalJwtAuthGuard)
  async findAll(
    @Param('slug') slug: string,
    @Request() req: any,
  ): Promise<MultipleCommentsResponse> {
    return this.commentsService.findAll(slug, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'slug', description: 'Slug of the article' })
  @ApiParam({ name: 'id', description: 'ID of the comment' })
  @ApiResponse({ status: 200, description: 'The comment has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async delete(
    @Param('slug') slug: string,
    @Param('id') id: number,
    @Request() req: any,
  ): Promise<void> {
    return this.commentsService.delete(slug, id, req.user.id);
  }
}
