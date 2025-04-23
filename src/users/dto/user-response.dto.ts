import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    description: 'User username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User JWT token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  token: string;

  @ApiProperty({
    description: 'User bio',
    example: 'I am a software developer',
  })
  bio: string;

  @ApiProperty({
    description: 'User image URL',
    example: 'https://i.pravatar.cc/300',
  })
  image: string;
}

export class UserResponse {
  @ApiProperty({
    description: 'User object',
    type: UserResponseDto,
  })
  user: UserResponseDto;
}
