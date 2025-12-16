import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const getSupabaseClient = (
  configService: ConfigService,
): SupabaseClient => {
  const supabaseUrl = configService.get<string>('SUPABASE_URL');
  const supabaseServiceRoleKey = configService.get<string>(
    'SUPABASE_SERVICE_ROLE_KEY',
  );

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is not defined in environment variables');
  }

  if (!supabaseServiceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables',
    );
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};
