import { ApiProperty } from '@nestjs/swagger';
import { ProfileResponseDto } from '../../users/dto/profile-response.dto';

export class CommentResponseDto {
  @ApiProperty({
    description: 'Comment ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Comment creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Comment update date',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Comment body',
    example: 'Great article!',
  })
  body: string;

  @ApiProperty({
    description: 'Comment author',
    type: ProfileResponseDto,
  })
  author: ProfileResponseDto;
}

export class SingleCommentResponse {
  @ApiProperty({
    description: 'Comment object',
    type: CommentResponseDto,
  })
  comment: CommentResponseDto;
}

export class MultipleCommentsResponse {
  @ApiProperty({
    description: 'List of comments',
    type: [CommentResponseDto],
  })
  comments: CommentResponseDto[];
}
