import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'User username',
    example: 'johndoe',
  })
  username: string;

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

  @ApiProperty({
    description: 'Is the user followed by the current user',
    example: false,
  })
  following: boolean;
}

export class ProfileResponse {
  @ApiProperty({
    description: 'Profile object',
    type: ProfileResponseDto,
  })
  profile: ProfileResponseDto;
}
