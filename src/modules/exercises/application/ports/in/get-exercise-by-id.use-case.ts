import { Exercise } from '../../../domain/entities/exercise.entity';

/**
 * Port (interface) para obtener un ejercicio por ID
 */
export abstract class GetExerciseByIdUseCase {
  abstract getExerciseById(id: string): Promise<Exercise>;
}
