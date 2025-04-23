import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment body',
    example: 'Great article!',
  })
  @IsNotEmpty()
  @IsString()
  readonly body: string;
}
