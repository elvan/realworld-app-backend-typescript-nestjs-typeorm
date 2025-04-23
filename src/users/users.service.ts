import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponse> {
    // Check if user with email or username already exists
    const existingByEmail = await this.userRepository.findOne({ 
      where: { email: createUserDto.email } 
    });
    
    if (existingByEmail) {
      throw new ConflictException('Email is already taken');
    }

    const existingByUsername = await this.userRepository.findOne({ 
      where: { username: createUserDto.username } 
    });
    
    if (existingByUsername) {
      throw new ConflictException('Username is already taken');
    }

    // Create the user
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.authService.generateToken(savedUser);

    // Return user with token
    return {
      user: savedUser.toAuthJSON(token),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<UserResponse> {
    // Validate user credentials
    const user = await this.authService.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    // Generate JWT token
    const token = this.authService.generateToken(user);

    // Return user with token
    return {
      user: user.toAuthJSON(token),
    };
  }

  async getCurrentUser(userId: number): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate JWT token
    const token = this.authService.generateToken(user);

    // Return user with token
    return {
      user: user.toAuthJSON(token),
    };
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being updated and it's already taken
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({ 
        where: { email: updateUserDto.email } 
      });
      
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email is already taken');
      }
    }

    // Check if username is being updated and it's already taken
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({ 
        where: { username: updateUserDto.username } 
      });
      
      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Username is already taken');
      }
    }

    // Update user fields
    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    // Generate JWT token
    const token = this.authService.generateToken(updatedUser);

    // Return user with token
    return {
      user: updatedUser.toAuthJSON(token),
    };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }
}
