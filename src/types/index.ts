import { User } from "@prisma/client";

export enum FatalErrorEvent {
  REJECTION = "REJECTION",
  EXCEPTION = "EXCEPTION",
}

export type UserWithoutPassword = Omit<User, "password">;
