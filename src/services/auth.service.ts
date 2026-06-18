import type {
  LoginDto,
  LoginResponseDto,
  LogoutDto,
  LogoutResponseDto,
  RegisterDto,
  RegisterResponseDto,
  ValidateDto,
  ValidateResponseDto,
} from "../dtos/auth.dto";
import { ConflictError, UnauthorizedError } from "../errors/app.error";
import { UserRepository } from "../repositories/user.repository";
import { TokenService } from "./token.service";

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponseDto> {
    const existingUser = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictError("email already registered");
    }

    return this.userRepository.create(dto.email, dto.senha);
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userRepository.findByCredentials(
      dto.email,
      dto.senha,
    );

    if (!user) {
      throw new UnauthorizedError("invalid credentials");
    }

    const token = this.tokenService.create(user.id, user.email);
    return { token };
  }

  validate(dto: ValidateDto): ValidateResponseDto {
    const session = this.tokenService.validate(dto.token);

    if (!session) {
      throw new UnauthorizedError("", { valid: false });
    }

    return {
      valid: true,
      userId: session.userId,
      email: session.email,
    };
  }

  logout(dto: LogoutDto): LogoutResponseDto {
    this.tokenService.revoke(dto.token);
    return { message: "logged out successfully" };
  }
}
