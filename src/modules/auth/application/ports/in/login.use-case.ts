import {
  User,
  UserSession,
} from 'src/modules/auth/domain/entities/user.entity';

export interface LoginUseCase {
  execute(data: LoginCommand): Promise<{ user: User; session: UserSession }>;
}

export class LoginCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
