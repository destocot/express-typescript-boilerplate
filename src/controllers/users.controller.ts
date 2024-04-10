import { type NextFunction, type Request, type Response } from "express";
import usersService from "@/services/users.service";
import {
  CreateUserSchema,
  DeleteUserSchema,
  RetrieveUserSchema,
  UpdateUserSchema,
} from "@/schemas/users.schema";

type EmptyObject = Record<string, never>;

export async function createUserHandler(
  req: Request<EmptyObject, EmptyObject, CreateUserSchema["body"]>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  try {
    const newUser = await usersService.createUser({ email, password });
    res.status(201).json(newUser);
  } catch (e) {
    next(e);
  }
}

export async function retrieveUsersHandler(req: Request, res: Response) {
  const users = await usersService.retrieveUsers();
  res.json(users);
}

export async function retrieveUserHandler(
  req: Request<RetrieveUserSchema["params"]>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const user = await usersService.retrieveUser(id);
  res.status(200).json(user);
}

export async function updateUserHandler(
  req: Request<
    UpdateUserSchema["params"],
    EmptyObject,
    UpdateUserSchema["body"]
  >,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  const { email } = req.body;
  try {
    const result = await usersService.updateUser(id, { email });
    res.json(result);
  } catch (e) {
    next(e);
  }
}

export async function deleteUserHandler(
  req: Request<DeleteUserSchema["params"]>,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const result = await usersService.deleteUser(id);
    res.json(result);
  } catch (e) {
    next(e);
  }
}
