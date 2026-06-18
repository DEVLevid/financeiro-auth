import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { asyncHandler } from "../middlewares/async-handler";
import { UserRepository } from "../repositories/user.repository";
import { AuthService } from "../services/auth.service";
import { TokenService } from "../services/token.service";

const userRepository = new UserRepository();
const tokenService = new TokenService();
const authService = new AuthService(userRepository, tokenService);
const authController = new AuthController(authService);

const router = Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.post("/validate", asyncHandler(authController.validate));
router.post("/logout", asyncHandler(authController.logout));

export default router;
