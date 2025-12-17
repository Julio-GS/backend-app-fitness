import { Exercise } from '../../../domain/entities/exercise.entity';

/**
 * Port (interface) para crear un ejercicio personalizado
 */
export abstract class CreateCustomExerciseUseCase {
  abstract createExercise(
    userId: string,
    name: string,
    nameEn: string,
    description: string,
    descriptionEn: string,
    muscleGroup: string,
    imageUrl?: string,
  ): Promise<Exercise>;
}
