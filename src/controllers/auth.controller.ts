import type { Request, Response } from "express";
import {
  validateLoginBody,
  validateRegisterBody,
  validateValidateBody,
} from "../validators/auth.validator";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const dto = validateRegisterBody(req.body);
    const user = await this.authService.register(dto);
    res.status(201).json(user);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const dto = validateLoginBody(req.body);
    const result = await this.authService.login(dto);
    res.status(200).json(result);
  };

  validate = async (req: Request, res: Response): Promise<void> => {
    const dto = validateValidateBody(req.body);
    const result = this.authService.validate(dto);
    res.status(200).json(result);
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const dto = validateValidateBody(req.body);
    const result = this.authService.logout(dto);
    res.status(200).json(result);
  };
}
