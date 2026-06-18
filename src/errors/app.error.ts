export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly payload?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, payload?: Record<string, unknown>) {
    super(message, 401, payload);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
