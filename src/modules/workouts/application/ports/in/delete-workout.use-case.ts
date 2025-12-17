export interface DeleteWorkoutUseCase {
  execute(workoutId: string, userId: string): Promise<void>;
}

export const DELETE_WORKOUT_USE_CASE = Symbol('DeleteWorkoutUseCase');
