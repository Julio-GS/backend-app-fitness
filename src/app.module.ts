import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
// import { getSupabaseClient } from './config/supabase.config'; // Si querés inyectar el cliente global después
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    // Acá después agregás los módulos feature (auth, users, etc.)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
