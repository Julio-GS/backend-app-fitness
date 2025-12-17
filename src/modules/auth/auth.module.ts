import { Module } from '@nestjs/common';
import { AuthService } from './application/services/auth.service';
import { SupabaseAuthAdapter } from './infrastructure/adapters/supabase-auth.adapter';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthRepositoryPort } from './application/ports/out/auth.repository.port';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    SupabaseAuthAdapter,
    {
      provide: AuthRepositoryPort,
      useExisting: SupabaseAuthAdapter,
    },
  ],
})
export class AuthModule {}
