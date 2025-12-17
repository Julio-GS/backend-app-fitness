import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exercise } from './domain/entities/exercise.entity';
import { ExerciseService } from './application/services/exercise.service';
import { TypeOrmExerciseRepository } from './infrastructure/adapters/typeorm-exercise.repository';
import { ExerciseController } from './infrastructure/controllers/exercise.controller';
import { ExerciseRepositoryPort } from './application/ports/out/exercise-repository.port';
import { CreateCustomExerciseUseCase } from './application/ports/in/create-custom-exercise.use-case';
import { GetExercisesUseCase } from './application/ports/in/get-exercises.use-case';
import { GetExerciseByIdUseCase } from './application/ports/in/get-exercise-by-id.use-case';

/**
 * Módulo de Exercises con arquitectura hexagonal
 * - Domain: Exercise entity, MuscleGroup enum
 * - Application: Use cases (ports), ExerciseService
 * - Infrastructure: TypeORM repository, Supabase Storage, Controller
 */
@Module({
  imports: [TypeOrmModule.forFeature([Exercise])],
  controllers: [ExerciseController],
  providers: [
    // Application Services
    ExerciseService,

    // Infrastructure Adapters (implementaciones de Ports)
    {
      provide: ExerciseRepositoryPort,
      useClass: TypeOrmExerciseRepository,
    },

    // Use Cases (para inyección de dependencias)
    {
      provide: CreateCustomExerciseUseCase,
      useExisting: ExerciseService,
    },
    {
      provide: GetExercisesUseCase,
      useExisting: ExerciseService,
    },
    {
      provide: GetExerciseByIdUseCase,
      useExisting: ExerciseService,
    },
  ],
  exports: [ExerciseService],
})
export class ExercisesModule {}
