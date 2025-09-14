import { Injectable } from '@nestjs/common';
import { User, Prisma, PrismaClient } from '../../generated/prisma';
import { PrismaService } from 'prisma/prisma.service';

// Custom types for better type safety
export type UserCreateData = Prisma.UserCreateInput;
export type UserUpdateData = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;
export type UserSelect = Prisma.UserSelect;

// Generic result type for pagination
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type UserBasicInfo = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    name: true;
  };
}>;

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  // Type-safe access to the user model
  private get user() {
    return this.prisma.user;
  }

  // Create with full type safety
  async create(data: UserCreateData): Promise<User> {
    return this.user.create({ data });
  }

  // Find many with flexible arguments
  async findMany(args?: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.user.findMany(args);
  }

  // Find unique with where clause
  async findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.user.findUnique({ where });
  }

  // Find first with where clause
  async findFirst(where: UserWhereInput): Promise<User | null> {
    return this.user.findFirst({ where });
  }

  // Update with type safety
  async update(
    where: Prisma.UserWhereUniqueInput,
    data: UserUpdateData,
  ): Promise<User> {
    return this.user.update({ where, data });
  }

  // Delete with type safety
  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.user.delete({ where });
  }

  // Count with where clause
  async count(where?: UserWhereInput): Promise<number> {
    return this.user.count({ where });
  }

  // Pagination with type safety
  async findManyPaginated(
    page: number = 1,
    limit: number = 10,
    where?: UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
  ): Promise<PaginatedResult<User>> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.user.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // Custom query with select
  async findBasicInfo(where?: UserWhereInput): Promise<UserBasicInfo[]> {
    return this.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  // Transaction example
  async createManyWithTransaction(users: UserCreateData[]): Promise<User[]> {
    return this.prisma.$transaction(
      users.map((user) => this.user.create({ data: user }))
    );
  }

  // Raw query with type safety (if needed)
  async findUsersByEmailPattern(pattern: string): Promise<User[]> {
    return this.prisma.$queryRaw<User[]>`
      SELECT * FROM "User" 
      WHERE email LIKE ${`%${pattern}%`}
    `;
  }
}
