import { 
  Controller, 
  Delete, 
  Get, 
  Param, 
  Post, 
  Request, 
  UseGuards 
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { ProfileResponse } from './dto/profile-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

@ApiTags('Profile')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':username')
  @ApiOperation({ summary: 'Get a profile' })
  @ApiParam({ name: 'username', description: 'Username of the profile to get' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile returned successfully.', 
    type: ProfileResponse 
  })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(OptionalJwtAuthGuard)
  async getProfile(
    @Param('username') username: string,
    @Request() req: any,
  ): Promise<ProfileResponse> {
    const userId = req.user?.id;
    return this.profilesService.getProfile(username, userId);
  }

  @Post(':username/follow')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiParam({ name: 'username', description: 'Username of the profile to follow' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile followed successfully.', 
    type: ProfileResponse 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async followUser(
    @Param('username') username: string,
    @Request() req: any,
  ): Promise<ProfileResponse> {
    return this.profilesService.followUser(username, req.user.id);
  }

  @Delete(':username/follow')
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiParam({ name: 'username', description: 'Username of the profile to unfollow' })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile unfollowed successfully.', 
    type: ProfileResponse 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async unfollowUser(
    @Param('username') username: string,
    @Request() req: any,
  ): Promise<ProfileResponse> {
    return this.profilesService.unfollowUser(username, req.user.id);
  }
}
