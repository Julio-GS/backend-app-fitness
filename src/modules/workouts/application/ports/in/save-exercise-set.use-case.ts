import { ExerciseSet } from '../../../domain/entities/exercise-set.entity';

export interface SaveExerciseSetDto {
  exerciseId: string;
  setNumber: number;
  weightKg?: number;
  reps?: number;
}

export interface SaveExerciseSetUseCase {
  saveSet(userId: string, sessionId: string, dto: SaveExerciseSetDto): Promise<ExerciseSet>;
}

export const SAVE_EXERCISE_SET_USE_CASE = Symbol('SaveExerciseSetUseCase');
