import usersService from "@/services/users.service";
import * as mockUserData from "@/__tests__/users/mock-data";
import { prismaMock } from "@/__tests__/prisma-mock";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";

describe("Users Service", () => {
  it("should be defined", () => {
    expect(usersService).toBeDefined();
  });

  describe("retrieve users", () => {
    it("should return users", async () => {
      prismaMock.user.findMany.mockResolvedValue([mockUserData.userPayload]);
      const users = await usersService.retrieveUsers();
      expect(users).toEqual([mockUserData.userPayload]);
      users.forEach((user) => {
        expect(user.id).toBeTruthy();
      });
    });

    it("should return an empty array if no users are found", async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      const users = await usersService.retrieveUsers();
      expect(users).toEqual([]);
    });
  });

  describe("retrieve user", () => {
    it("should return a user", async () => {
      prismaMock.user.findUnique.mockResolvedValue(mockUserData.userPayload);
      const user = await usersService.retrieveUser(mockUserData.userId);

      expect(user).toEqual(mockUserData.userPayload);
    });

    it("should return null if no user is found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      const user = await usersService.retrieveUser(mockUserData.userId);
      expect(user).toBeNull();
    });
  });

  describe("create user", () => {
    it("should create a user", async () => {
      prismaMock.user.create.mockResolvedValue(mockUserData.userPayload);

      const user = await usersService.createUser(mockUserData.userInput);
      expect(user).toEqual(mockUserData.userPayload);
      expect(user.email).toEqual(mockUserData.userPayload.email);
    });

    it("should throw an error if data is invalid", async () => {
      prismaMock.user.create.mockRejectedValue(
        new PrismaClientValidationError("", {
          clientVersion: mockUserData.prismaClientVersion,
        })
      );

      try {
        await usersService.createUser(mockUserData.userInput);
      } catch (e) {
        expect(e).toBeInstanceOf(PrismaClientValidationError);
      }
    });
  });

  describe("update user", () => {
    it("should update a user", async () => {
      prismaMock.user.update.mockResolvedValue(mockUserData.updateUserPayload);
      const user = await usersService.updateUser(
        mockUserData.userId,
        mockUserData.updateUserInput
      );
      expect(user).toEqual(mockUserData.updateUserPayload);
      expect(user.email).not.toEqual(mockUserData.userPayload.email);
    });

    it("should throw an error if data is invalid", async () => {
      prismaMock.user.update.mockRejectedValue(
        new PrismaClientValidationError("", {
          clientVersion: mockUserData.prismaClientVersion,
        })
      );
      try {
        await usersService.updateUser(
          mockUserData.userId,
          mockUserData.updateUserInput
        );
      } catch (e) {
        expect(e).toBeInstanceOf(PrismaClientValidationError);
      }
    });
  });

  describe("delete user", () => {
    it("should delete a user", async () => {
      prismaMock.user.delete.mockResolvedValue(mockUserData.userPayload);
      const user = await usersService.deleteUser(mockUserData.userId);
      expect(user).toEqual(mockUserData.userPayload);
    });

    it("should throw an error if no user is found", async () => {
      prismaMock.user.delete.mockRejectedValue(
        new PrismaClientKnownRequestError("", {
          code: "P2025",
          clientVersion: mockUserData.prismaClientVersion,
        })
      );
      try {
        await usersService.deleteUser(mockUserData.userId);
      } catch (e) {
        expect(e).toBeInstanceOf(PrismaClientKnownRequestError);
        expect((e as PrismaClientKnownRequestError).code).toBe("P2025");
      }
    });
  });
});
