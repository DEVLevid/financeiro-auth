import { pool } from "../db";
import type { User } from "../types";

function deriveNameFromEmail(email: string): string {
  const localPart = email.split("@")[0];
  return localPart || email;
}

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT id, name, email, password FROM users WHERE email = $1",
      [email],
    );

    return result.rows[0] ?? null;
  }

  async create(
    email: string,
    password: string,
  ): Promise<{ id: number; email: string }> {
    const name = deriveNameFromEmail(email);

    const result = await pool.query<{ id: number; email: string }>(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, email",
      [name, email, password],
    );

    return result.rows[0];
  }

  async findByCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT id, name, email, password FROM users WHERE email = $1 AND password = $2",
      [email, password],
    );

    return result.rows[0] ?? null;
  }
}
