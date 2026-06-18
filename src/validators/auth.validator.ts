import { BadRequestError } from "../errors/app.error";
import type { LoginDto, RegisterDto, ValidateDto } from "../dtos/auth.dto";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateRegisterBody(body: unknown): RegisterDto {
  const { email, senha } = body as RegisterDto;

  if (!isNonEmptyString(email) || !isNonEmptyString(senha)) {
    throw new BadRequestError("email and password are required");
  }

  return { email, senha };
}

export function validateLoginBody(body: unknown): LoginDto {
  const { email, senha } = body as LoginDto;

  if (!isNonEmptyString(email) || !isNonEmptyString(senha)) {
    throw new BadRequestError("email and password are required");
  }

  return { email, senha };
}

export function validateValidateBody(body: unknown): ValidateDto {
  const { token } = body as ValidateDto;

  if (!isNonEmptyString(token)) {
    throw new BadRequestError("token is required");
  }

  return { token };
}
