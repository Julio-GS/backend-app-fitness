import {
  User,
  UserSession,
} from 'src/modules/auth/domain/entities/user.entity';

export interface RegisterUseCase {
  execute(data: RegisterCommand): Promise<{ user: User; session: UserSession }>;
}

export class RegisterCommand {
  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly name: string,
  ) {}
}
