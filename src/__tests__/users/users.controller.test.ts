import supertest from "supertest";
import http from "node:http";
import usersService from "@/services/users.service";
import server from "@/server";
import * as mockUserData from "@/__tests__/users/mock-data";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const httpServer = http.createServer(server);

describe("Users Controller", () => {
  it("should be defined", () => {});

  describe("GET /api/users", () => {
    it("should return all users", async () => {
      const retrieveUsersMock = jest
        .spyOn(usersService, "retrieveUsers")
        .mockResolvedValueOnce([mockUserData.userPayload]);

      const { status, body } = await supertest(httpServer).get("/api/users");

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBe(true);
      expect(retrieveUsersMock).toHaveBeenCalled();
    });
  });

  describe("GET /api/users/:id", () => {
    it("should return a user", async () => {
      const getUserServiceMock = jest
        .spyOn(usersService, "retrieveUser")
        .mockResolvedValueOnce(mockUserData.userPayload);

      const { status, body } = await supertest(httpServer).get(
        `/api/users/${mockUserData.userId}`
      );

      expect(status).toBe(200);
      expect(body).toMatchObject(mockUserData.userPayload);
      expect(getUserServiceMock).toHaveBeenCalledWith(mockUserData.userId);
    });

    it("should return null if user is not found", async () => {
      const getUserServiceMock = jest
        .spyOn(usersService, "retrieveUser")
        .mockResolvedValueOnce(null);

      const { status, body } = await supertest(httpServer).get(
        `/api/users/${mockUserData.userId}`
      );

      expect(status).toBe(200);
      expect(body).toBeNull();
      expect(getUserServiceMock).toHaveBeenCalledWith(mockUserData.userId);
    });
  });

  describe("POST /api/users", () => {
    it("should create a user", async () => {
      const createUserMock = jest
        .spyOn(usersService, "createUser")
        .mockResolvedValueOnce(mockUserData.userPayload);

      const { status, body } = await supertest(httpServer)
        .post("/api/users")
        .send(mockUserData.userInput);

      expect(status).toBe(201);
      expect(body).toEqual(mockUserData.userPayload);
      expect(createUserMock).toHaveBeenCalledWith(mockUserData.userInput);
    });

    it("should return a 409 if email already exists", async () => {
      jest.spyOn(usersService, "createUser").mockRejectedValueOnce(
        new PrismaClientKnownRequestError("", {
          code: "P2002",
          clientVersion: mockUserData.prismaClientVersion,
        })
      );

      const { status } = await supertest(httpServer)
        .post("/api/users")
        .send(mockUserData.userInput);

      expect(status).toBe(409);
    });

    it("should return a 400 if email is missing", async () => {
      const { status } = await supertest(httpServer)
        .post("/api/users")
        .send({ ...mockUserData.userInput, email: undefined });

      expect(status).toBe(400);
    });

    it("should return a 400 if password is missing", async () => {
      const { status } = await supertest(httpServer)
        .post("/api/users")
        .send({ ...mockUserData.userInput, password: undefined });

      expect(status).toBe(400);
    });
  });

  describe("PUT /api/users/:id", () => {
    it("should update a user's email", async () => {
      const updateUserMock = jest
        .spyOn(usersService, "updateUser")
        .mockResolvedValueOnce(mockUserData.updateUserPayload);

      const { status, body } = await supertest(httpServer)
        .put(`/api/users/${mockUserData.userId}`)
        .send(mockUserData.updateUserInput);

      expect(status).toBe(200);
      expect(body).toEqual(mockUserData.updateUserPayload);
      expect(body.email).not.toEqual(mockUserData.userPayload.email);
      expect(updateUserMock).toHaveBeenCalledWith(
        mockUserData.userId,
        mockUserData.updateUserInput
      );
    });

    it("should return a 400 if email and password is missing", async () => {
      const { status } = await supertest(httpServer).put(
        `/api/users/${mockUserData.userId}`
      );

      expect(status).toBe(400);
    });
  });

  describe("DELETE /api/users", () => {
    it("should delete a user", async () => {
      const deleteUserMock = jest
        .spyOn(usersService, "deleteUser")
        .mockResolvedValueOnce(mockUserData.userPayload);

      const { status, body } = await supertest(httpServer).delete(
        `/api/users/${mockUserData.userId}`
      );

      expect(status).toBe(200);
      expect(body).toEqual(mockUserData.userPayload);
      expect(deleteUserMock).toHaveBeenCalledWith(mockUserData.userId);
    });

    it("should return null if user is not found", async () => {
      jest.spyOn(usersService, "deleteUser").mockRejectedValue(
        new PrismaClientKnownRequestError("", {
          code: "P2025",
          clientVersion: mockUserData.prismaClientVersion,
        })
      );

      const { status } = await supertest(httpServer).delete(
        `/api/users/${mockUserData.userId}`
      );

      expect(status).toBe(404);
    });
  });
});
