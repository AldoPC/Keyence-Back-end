import { Router } from "express";
import UserController from "../../controllers/userController";

const userRouter = Router();

userRouter.get("/", UserController.getUsers);

userRouter.get("/:id", UserController.getUser);

userRouter.post("/", UserController.createUser);

userRouter.post("/file", UserController.createUsersFromFile);

userRouter.delete("/:id", UserController.deleteUser);

userRouter.put("/:id", UserController.updateUser);

export default userRouter;
