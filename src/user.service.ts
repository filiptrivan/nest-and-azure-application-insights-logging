import { Injectable, NotFoundException } from '@nestjs/common';
import { User, Prisma } from 'generated/prisma/client';
import { UserRepository, UserCreateData, UserUpdateData, PaginatedResult } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  // Business logic methods with strong typing
  async createUser(data: UserCreateData): Promise<User> {
    return this.userRepository.create(data);
  }

  async getUsers(page?: number, limit?: number): Promise<User[] | PaginatedResult<User>> {
    if (page && limit) {
      return this.userRepository.findManyPaginated(page, limit);
    }
    return this.userRepository.findMany();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findUnique({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findUnique({ email });
  }

  async updateUser(id: number, data: UserUpdateData): Promise<User> {
    // Check if user exists first
    await this.getUserById(id);
    
    return this.userRepository.update({ id }, data);
  }

  async deleteUser(id: number): Promise<User> {
    // Check if user exists first
    await this.getUserById(id);
    
    return this.userRepository.delete({ id });
  }

  async searchUsers(emailPattern?: string): Promise<User[]> {
    if (emailPattern) {
      return this.userRepository.findUsersByEmailPattern(emailPattern);
    }
    return this.userRepository.findMany();
  }

  async getUsersCount(): Promise<number> {
    return this.userRepository.count();
  }

  // Example of business logic with type safety
  async createUserIfNotExists(data: UserCreateData): Promise<{ user: User; created: boolean }> {
    const existingUser = await this.userRepository.findUnique({ email: data.email });
    
    if (existingUser) {
      return { user: existingUser, created: false };
    }

    const newUser = await this.userRepository.create(data);
    return { user: newUser, created: true };
  }
}
