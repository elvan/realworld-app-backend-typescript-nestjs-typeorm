import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'johndoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly username?: string;

  @ApiProperty({
    description: 'User email',
    example: 'john@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  readonly password?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'I am a software developer',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly bio?: string;

  @ApiProperty({
    description: 'User image URL',
    example: 'https://i.pravatar.cc/300',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly image?: string;
}
