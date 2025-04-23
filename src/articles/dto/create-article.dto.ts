import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Article title',
    example: 'How to train your dragon',
  })
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Article description',
    example: 'Ever wonder how?',
  })
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @ApiProperty({
    description: 'Article body',
    example: 'You have to believe',
  })
  @IsNotEmpty()
  @IsString()
  readonly body: string;

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
