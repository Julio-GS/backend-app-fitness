import { WorkoutCategory } from '../../../domain/entities/workout-category.entity';

export interface WorkoutCategoryRepositoryPort {
  findAll(): Promise<WorkoutCategory[]>;
  findById(id: string): Promise<WorkoutCategory | null>;
}

export const WORKOUT_CATEGORY_REPOSITORY_PORT = Symbol(
  'WorkoutCategoryRepositoryPort',
);
