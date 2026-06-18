import { randomUUID } from "crypto";
import type { TokenSession } from "../types";

export class TokenService {
  private readonly tokens = new Map<string, TokenSession>();

  create(userId: number, email: string): string {
    const token = randomUUID();
    this.tokens.set(token, { userId, email });
    return token;
  }

  validate(token: string): TokenSession | null {
    return this.tokens.get(token) ?? null;
  }

  revoke(token: string): void {
    this.tokens.delete(token);
  }
}
