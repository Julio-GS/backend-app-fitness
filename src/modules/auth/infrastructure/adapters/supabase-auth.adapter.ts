import { Injectable, Logger } from '@nestjs/common';
import { AuthRepositoryPort } from '../../application/ports/out/auth.repository.port';
import { User, UserSession } from '../../domain/entities/user.entity';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseAuthAdapter implements AuthRepositoryPort {
  private readonly logger = new Logger(SupabaseAuthAdapter.name);
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
    const url = this.configService.get<string>('SUPABASE_URL') ?? '';
    const key = this.configService.get<string>('SUPABASE_ANON_KEY') ?? '';
    this.supabase = createClient(url, key) as SupabaseClient;
  }

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<{ user: User; session: UserSession }> {
    this.logger.log({ message: 'Attempting user registration', email });
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      this.logger.error({
        message: 'Registration failed - Supabase error',
        email,
        error: error.message,
        errorDetails: error,
      });
      throw new Error(error.message || 'Registration failed');
    }

    if (!data.user) {
      this.logger.error({
        message: 'Registration failed - No user returned',
        email,
      });
      throw new Error('Registration failed: No user created');
    }

    // Si no hay sesión, es porque se requiere confirmación de email
    if (!data.session) {
      this.logger.warn({
        message: 'User created but email confirmation required',
        userId: data.user.id,
        email,
      });
      throw new Error(
        'Registration successful. Please check your email to confirm your account.',
      );
    }

    this.logger.log({
      message: 'User registered successfully',
      userId: data.user.id,
      email,
    });
    return {
      user: new User(
        data.user.id,
        data.user.email ?? '',
        new Date(data.user.created_at),
        new Date(data.user.updated_at ?? data.user.created_at),
      ),
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
      },
    };
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; session: UserSession }> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user || !data.session) {
      throw new Error(error?.message || 'Login failed');
    }
    return {
      user: new User(
        data.user.id,
        data.user.email ?? '',
        new Date(data.user.created_at),
        new Date(data.user.updated_at ?? data.user.created_at),
      ),
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_in: data.session.expires_in,
        token_type: data.session.token_type,
      },
    };
  }

  async verifyToken(token: string): Promise<User | null> {
    const { data, error } = await this.supabase.auth.getUser(token);
    if (error || !data.user) return null;
    return new User(
      data.user.id,
      data.user.email ?? '',
      new Date(data.user.created_at),
      new Date(data.user.updated_at ?? data.user.created_at),
    );
  }
}
