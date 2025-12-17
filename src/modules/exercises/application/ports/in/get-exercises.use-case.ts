import { Exercise } from '../../../domain/entities/exercise.entity';

/**
 * Port (interface) para obtener lista de ejercicios
 */
export abstract class GetExercisesUseCase {
  abstract getExercises(
    userId?: string,
    muscleGroup?: string,
  ): Promise<Exercise[]>;
}
