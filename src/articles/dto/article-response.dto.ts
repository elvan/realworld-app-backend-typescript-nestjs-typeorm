import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from '../../users/dto/profile-response.dto';

export class ArticleResponseDto {
  @ApiProperty({
    description: 'Article slug',
    example: 'how-to-train-your-dragon-123abc',
  })
  slug: string;

  @ApiProperty({
    description: 'Article title',
    example: 'How to train your dragon',
  })
  title: string;

  @ApiProperty({
    description: 'Article description',
    example: 'Ever wonder how?',
  })
  description: string;

  @ApiProperty({
    description: 'Article body',
    example: 'You have to believe',
  })
  body: string;

  @ApiProperty({
    description: 'Article tags',
    example: ['dragons', 'training'],
  })
  tagList: string[];

  @ApiProperty({
    description: 'Article creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Article update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Is the article favorited by the current user',
    example: false,
  })
  favorited: boolean;

  @ApiProperty({
    description: 'Number of users who favorited the article',
    example: 0,
  })
  favoritesCount: number;

  @ApiProperty({
    description: 'Article author',
    type: ProfileResponseDto,
  })
  author: ProfileResponseDto;
}

export class SingleArticleResponse {
  @ApiProperty({
    description: 'Article object',
    type: ArticleResponseDto,
  })
  article: ArticleResponseDto;
}

export class MultipleArticlesResponse {
  @ApiProperty({
    description: 'List of articles',
    type: [ArticleResponseDto],
  })
  articles: ArticleResponseDto[];

  @ApiProperty({
    description: 'Total number of articles',
    example: 0,
  })
  articlesCount: number;
}
