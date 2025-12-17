export interface UserSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
