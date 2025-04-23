import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateArticleDto {
  @ApiProperty({
    description: 'Article title',
    example: 'How to train your dragon',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly title?: string;

  @ApiProperty({
    description: 'Article description',
    example: 'Ever wonder how?',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({
    description: 'Article body',
    example: 'You have to believe',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly body?: string;

  @ApiProperty({
    description: 'Article tags',
    example: ['dragons', 'training'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly tagList?: string[];
}
