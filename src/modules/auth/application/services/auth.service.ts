import { Injectable } from '@nestjs/common';
import {
  RegisterUseCase,
  RegisterCommand,
} from '../ports/in/register.use-case';
import { LoginUseCase, LoginCommand } from '../ports/in/login.use-case';
import { AuthRepositoryPort } from '../ports/out/auth.repository.port';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AuthService implements RegisterUseCase, LoginUseCase {
  constructor(private readonly authRepository: AuthRepositoryPort) {}

  async execute(data: RegisterCommand | LoginCommand): Promise<{
    user: User;
    session: import('../../domain/entities/user.entity').UserSession;
  }> {
    if (data instanceof RegisterCommand) {
      return this.authRepository.register(data.email, data.password, data.name);
    } else if (data instanceof LoginCommand) {
      return this.authRepository.login(data.email, data.password);
    }
    throw new Error('Invalid command');
  }
}
