import { Router } from "express";
import AuthController from "../../controllers/authController";

const authRouter = Router();

authRouter.post("/signup", AuthController.signUp);

authRouter.post("/signin", AuthController.signIn);

authRouter.get("/account", AuthController.getAccount);

export default authRouter;
