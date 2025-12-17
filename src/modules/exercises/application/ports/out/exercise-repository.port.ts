import { Exercise } from '../../../domain/entities/exercise.entity';

/**
 * Port (abstracción) para el repositorio de ejercicios
 * Usamos abstract class en lugar de interface para que NestJS pueda inyectarlo con DI
 */
export abstract class ExerciseRepositoryPort {
  abstract findAll(userId?: string, muscleGroup?: string): Promise<Exercise[]>;
  abstract findById(id: string): Promise<Exercise | null>;
  abstract create(exercise: Exercise): Promise<Exercise>;
  abstract bulkCreate(exercises: Exercise[]): Promise<Exercise[]>;
}
