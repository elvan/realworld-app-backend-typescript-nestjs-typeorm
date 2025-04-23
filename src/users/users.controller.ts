import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Put, 
  UseGuards, 
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('User and Authentication')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('users')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ 
    status: 201, 
    description: 'User has been successfully created.', 
    type: UserResponse 
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  async register(@Body('user') createUserDto: CreateUserDto): Promise<UserResponse> {
    return this.usersService.register(createUserDto);
  }

  @Post('users/login')
  @ApiOperation({ summary: 'Login for existing user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully logged in.', 
    type: UserResponse 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponse> {
    return this.usersService.login(loginUserDto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user info returned.', 
    type: UserResponse 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getCurrentUser(@Request() req: any): Promise<UserResponse> {
    return this.usersService.getCurrentUser(req.user.id);
  }

  @Put('user')
  @ApiOperation({ summary: 'Update current user' })
  @ApiResponse({ 
    status: 200, 
    description: 'User has been successfully updated.', 
    type: UserResponse 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 422, description: 'Validation Error' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async updateUser(
    @Request() req: any,
    @Body('user') updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    return this.usersService.updateUser(req.user.id, updateUserDto);
  }
}
