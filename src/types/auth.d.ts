export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: string;
}