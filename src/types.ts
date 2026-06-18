export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface TokenSession {
  userId: number;
  email: string;
}
