import { UpdateUserSchema } from "@/schemas/users.schema";
import { createId } from "@paralleldrive/cuid2";
import { Prisma, User } from "@prisma/client";

export const userId = createId();

export const userPayload = {
  id: userId as string,
  email: "test@email.com",
  createdAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
  updatedAt: new Date("2024-01-01T00:00:00.000Z").toISOString(),
} as unknown as User;

export const userInput = {
  email: "test@email.com",
  password: "testword",
} as unknown as Prisma.UserCreateInput;

export const updateUserInput = {
  email: "testUpdated@email.com",
} as unknown as UpdateUserSchema["body"];

export const updateUserPayload = {
  ...userPayload,
  ...updateUserInput,
} as unknown as User;

// eslint-disable-next-line @typescript-eslint/no-var-requires
export const prismaClientVersion = require("../../../package.json")
  .dependencies["@prisma/client"];
