import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardioSession } from './domain/entities/cardio-session.entity';
import { CardioService } from './application/services/cardio.service';
import { TypeOrmCardioSessionRepository } from './infrastructure/adapters/typeorm-cardio-session.repository';
import { CardioController } from './infrastructure/controllers/cardio.controller';
import {
  CARDIO_SESSION_REPOSITORY,
} from './application/ports/out/cardio-session.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([CardioSession])],
  providers: [
    CardioService,
    {
      provide: CARDIO_SESSION_REPOSITORY,
      useClass: TypeOrmCardioSessionRepository,
    },
  ],
  controllers: [CardioController],
  exports: [CardioService]
})
export class CardioModule {}
