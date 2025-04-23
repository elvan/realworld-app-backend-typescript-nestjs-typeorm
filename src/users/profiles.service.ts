import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ProfileResponse } from './dto/profile-response.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getProfile(username: string, currentUserId?: number): Promise<ProfileResponse> {
    const user = await this.userRepository.findOne({ 
      where: { username },
      relations: ['followers'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the current user is following this user
    let following = false;
    
    if (currentUserId) {
      following = user.followers.some(follower => follower.id === currentUserId);
    }

    return {
      profile: user.toProfileJSON(following),
    };
  }

  async followUser(username: string, currentUserId: number): Promise<ProfileResponse> {
    const user = await this.userRepository.findOne({ 
      where: { username },
      relations: ['followers'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Check if already following
    const isFollowing = user.followers.some(follower => follower.id === currentUserId);
    
    if (!isFollowing) {
      // Add to following
      currentUser.following.push(user);
      await this.userRepository.save(currentUser);
    }

    return {
      profile: user.toProfileJSON(true),
    };
  }

  async unfollowUser(username: string, currentUserId: number): Promise<ProfileResponse> {
    const user = await this.userRepository.findOne({ 
      where: { username },
      relations: ['followers'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentUser = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['following'],
    });

    if (!currentUser) {
      throw new NotFoundException('Current user not found');
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      followedUser => followedUser.id !== user.id
    );
    
    await this.userRepository.save(currentUser);

    return {
      profile: user.toProfileJSON(false),
    };
  }
}
