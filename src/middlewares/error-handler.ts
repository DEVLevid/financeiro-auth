import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app.error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof AppError) {
    const body: Record<string, unknown> = { ...error.payload };

    if (error.message) {
      body.message = error.message;
    }

    res.status(error.statusCode).json(body);
    return;
  }

  console.error(error);
  res.status(500).json({ message: "internal server error" });
}
