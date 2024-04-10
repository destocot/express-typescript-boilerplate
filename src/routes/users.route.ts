import { Router } from "express";
import {
  createUserHandler,
  deleteUserHandler,
  retrieveUserHandler,
  retrieveUsersHandler,
  updateUserHandler,
} from "@/controllers/users.controller";
import { validateResource } from "@/middleware/validate-resource";
import {
  createUserSchema,
  deleteUserSchema,
  retrieveUserSchema,
  updateUserSchema,
} from "@/schemas/users.schema";

const router = Router();

router.get("/", retrieveUsersHandler);

router.get("/:id", validateResource(retrieveUserSchema), retrieveUserHandler);

router.post("/", validateResource(createUserSchema), createUserHandler);

router.put("/:id", validateResource(updateUserSchema), updateUserHandler);

router.delete("/:id", validateResource(deleteUserSchema), deleteUserHandler);

export default router;
