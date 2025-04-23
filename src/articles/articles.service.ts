import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { User } from '../users/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleQueryDto } from './dto/article-query.dto';
import { FeedQueryDto } from './dto/feed-query.dto';
import { ArticleResponseDto, MultipleArticlesResponse, SingleArticleResponse } from './dto/article-response.dto';
import { ProfilesService } from '../users/profiles.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly profilesService: ProfilesService,
  ) {}

  async create(
    currentUserId: number,
    createArticleDto: CreateArticleDto,
  ): Promise<SingleArticleResponse> {
    const user = await this.userRepository.findOne({ where: { id: currentUserId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      author: user,
    });

    // Handle tags
    if (createArticleDto.tagList?.length) {
      const tags = await this.getOrCreateTags(createArticleDto.tagList);
      article.tags = tags;
    }

    const savedArticle = await this.articleRepository.save(article);
    
    return {
      article: await this.buildArticleResponse(savedArticle, currentUserId),
    };
  }

  async findAll(
    query: ArticleQueryDto,
    currentUserId?: number,
  ): Promise<MultipleArticlesResponse> {
    const queryBuilder = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy');

    // Apply tag filter
    if (query.tag) {
      queryBuilder.andWhere('tag.name = :tag', { tag: query.tag });
    }

    // Apply author filter
    if (query.author) {
      queryBuilder.andWhere('author.username = :username', { username: query.author });
    }

    // Apply favorited filter
    if (query.favorited) {
      queryBuilder.andWhere(qb => {
        const subQuery = qb.subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.username = :favoritedUsername', { favoritedUsername: query.favorited })
          .getQuery();
        return 'favoritedBy.id IN ' + subQuery;
      });
    }

    // Apply pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('article.createdAt', 'DESC');

    const [articles, articlesCount] = await queryBuilder.getManyAndCount();

    const articlesResponse = await Promise.all(
      articles.map(article => this.buildArticleResponse(article, currentUserId))
    );

    return {
      articles: articlesResponse,
      articlesCount,
    };
  }

  async getFeed(
    currentUserId: number,
    query: FeedQueryDto,
  ): Promise<MultipleArticlesResponse> {
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followingIds = user.following.map(follow => follow.id);

    // If user doesn't follow anyone, return empty response
    if (followingIds.length === 0) {
      return {
        articles: [],
        articlesCount: 0,
      };
    }

    const queryBuilder = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tag')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
      .where('author.id IN (:...followingIds)', { followingIds });

    // Apply pagination
    const limit = query.limit || 20;
    const offset = query.offset || 0;

    queryBuilder.skip(offset).take(limit);
    queryBuilder.orderBy('article.createdAt', 'DESC');

    const [articles, articlesCount] = await queryBuilder.getManyAndCount();

    const articlesResponse = await Promise.all(
      articles.map(article => this.buildArticleResponse(article, currentUserId))
    );

    return {
      articles: articlesResponse,
      articlesCount,
    };
  }

  async findOne(
    slug: string,
    currentUserId?: number,
  ): Promise<SingleArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'favoritedBy'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    return {
      article: await this.buildArticleResponse(article, currentUserId),
    };
  }

  async update(
    slug: string,
    currentUserId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<SingleArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'favoritedBy'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    // Check if the current user is the author
    if (article.author.id !== currentUserId) {
      throw new UnauthorizedException('You are not the author of this article');
    }

    // Update fields
    if (updateArticleDto.title) article.title = updateArticleDto.title;
    if (updateArticleDto.description) article.description = updateArticleDto.description;
    if (updateArticleDto.body) article.body = updateArticleDto.body;

    // Handle tags update
    if (updateArticleDto.tagList) {
      const tags = await this.getOrCreateTags(updateArticleDto.tagList);
      article.tags = tags;
    }

    const savedArticle = await this.articleRepository.save(article);
    
    return {
      article: await this.buildArticleResponse(savedArticle, currentUserId),
    };
  }

  async delete(slug: string, currentUserId: number): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    // Check if the current user is the author
    if (article.author.id !== currentUserId) {
      throw new UnauthorizedException('You are not the author of this article');
    }

    await this.articleRepository.remove(article);
  }

  async favorite(slug: string, currentUserId: number): Promise<SingleArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'favoritedBy'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    const user = await this.userRepository.findOne({ where: { id: currentUserId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already favorited
    const isAlreadyFavorited = article.favoritedBy.some(
      favoritedUser => favoritedUser.id === currentUserId
    );

    if (!isAlreadyFavorited) {
      article.favoritedBy.push(user);
      await this.articleRepository.save(article);
    }

    return {
      article: await this.buildArticleResponse(article, currentUserId, true),
    };
  }

  async unfavorite(slug: string, currentUserId: number): Promise<SingleArticleResponse> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'tags', 'favoritedBy'],
    });

    if (!article) {
      throw new NotFoundException(`Article with slug ${slug} not found`);
    }

    // Remove from favoritedBy
    article.favoritedBy = article.favoritedBy.filter(
      favoritedUser => favoritedUser.id !== currentUserId
    );
    
    await this.articleRepository.save(article);

    return {
      article: await this.buildArticleResponse(article, currentUserId, false),
    };
  }

  private async getOrCreateTags(tagNames: string[]): Promise<Tag[]> {
    const existingTags = await this.tagRepository.find({
      where: { name: In(tagNames) },
    });

    const existingTagNames = existingTags.map(tag => tag.name);
    const newTagNames = tagNames.filter(name => !existingTagNames.includes(name));

    const newTags = newTagNames.map(name => this.tagRepository.create({ name }));
    
    if (newTags.length > 0) {
      await this.tagRepository.save(newTags);
    }

    return [...existingTags, ...newTags];
  }

  private async buildArticleResponse(
    article: Article,
    currentUserId?: number,
    forceFavorited?: boolean,
  ): Promise<ArticleResponseDto> {
    // Get profile of the author
    const { profile } = await this.profilesService.getProfile(
      article.author.username,
      currentUserId,
    );

    // Check if article is favorited by current user
    let favorited = false;
    
    if (forceFavorited !== undefined) {
      favorited = forceFavorited;
    } else if (currentUserId && article.favoritedBy) {
      favorited = article.favoritedBy.some(user => user.id === currentUserId);
    }

    // Get tag list
    const tagList = article.tags ? article.tags.map(tag => tag.name) : [];

    // Get favorites count
    const favoritesCount = article.favoritedBy ? article.favoritedBy.length : 0;

    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited,
      favoritesCount,
      author: profile,
    };
  }
}
