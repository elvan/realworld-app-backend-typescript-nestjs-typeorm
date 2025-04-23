import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentResponseDto, MultipleCommentsResponse, SingleCommentResponse } from './dto/comment-response.dto';
import { ProfilesService } from '../users/profiles.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(
    slug: string,
    currentUserId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<SingleCommentResponse> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: currentUserId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const comment = this.commentRepository.create({
      ...createCommentDto,
      article,
      author: user,
    });

    const savedComment = await this.commentRepository.save(comment);
    
    return {
      comment: await this.buildCommentResponse(savedComment, currentUserId),
    };
  }

  async findAll(
    slug: string,
    currentUserId?: number,
  ): Promise<MultipleCommentsResponse> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    
    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    const comments = await this.commentRepository.find({
      where: { article: { id: article.id } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    const commentsResponse = await Promise.all(
      comments.map(comment => this.buildCommentResponse(comment, currentUserId))
    );

    return {
      comments: commentsResponse,
    };
  }

  async delete(
    slug: string,
    commentId: number,
    currentUserId: number,
  ): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['author', 'article'],
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${commentId} not found`);
    }

    if (comment.article.slug !== slug) {
      throw new NotFoundException(`Comment not found in article with slug ${slug}`);
    }

    // Check if the current user is the author of the comment
    if (comment.author.id !== currentUserId) {
      throw new UnauthorizedException('You are not the author of this comment');
    }

    await this.commentRepository.remove(comment);
  }

  private async buildCommentResponse(
    comment: Comment,
    currentUserId?: number,
  ): Promise<CommentResponseDto> {
    // Get profile of the comment author
    const { profile } = await this.profilesService.getProfile(
      comment.author.username,
      currentUserId,
    );

    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: profile,
    };
  }
}
