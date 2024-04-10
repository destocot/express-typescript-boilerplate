import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
import type { Prisma, User } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { UserWithoutPassword } from "@/types";

export class UsersRepository {
  private usersRepository: Prisma.UserDelegate<DefaultArgs>;

  constructor(prismaClient: PrismaClient) {
    this.usersRepository = prismaClient.user;
  }

  async create(user: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    return await this.usersRepository.create({
      data: user,
      select: {
        id: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findMany(): Promise<Array<UserWithoutPassword>> {
    return await this.usersRepository.findMany({
      select: {
        id: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: User["id"]): Promise<UserWithoutPassword | null> {
    return await this.usersRepository.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // async findOneByEmail(email: User["email"]): Promise<User | null> {
  //   return await this.usersRepository.findUnique({
  //     where: { email },
  //   });
  // }

  async update(
    id: User["id"],
    user: Prisma.UserUpdateInput
  ): Promise<UserWithoutPassword> {
    return await this.usersRepository.update({
      where: { id },
      data: user,
      select: {
        id: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: User["id"]): Promise<UserWithoutPassword> {
    return this.usersRepository.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        password: false,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

const usersRepository = new UsersRepository(prisma);

export default usersRepository;
