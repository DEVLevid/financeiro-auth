export interface RegisterDto {
  email: string;
  senha: string;
}

export interface LoginDto {
  email: string;
  senha: string;
}

export interface ValidateDto {
  token: string;
}

export type LogoutDto = ValidateDto;

export interface RegisterResponseDto {
  id: number;
  email: string;
}

export interface LoginResponseDto {
  token: string;
}

export interface ValidateResponseDto {
  valid: boolean;
  userId?: number;
  email?: string;
}

export interface LogoutResponseDto {
  message: string;
}

export interface ErrorResponseDto {
  message: string;
  valid?: boolean;
}
