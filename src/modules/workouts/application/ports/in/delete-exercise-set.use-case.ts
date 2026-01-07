export interface DeleteExerciseSetUseCase {
  deleteExerciseSet(
    userId: string,
    sessionId: string,
    setId: string,
  ): Promise<void>;
}

export const DELETE_EXERCISE_SET_USE_CASE = Symbol(
  'DeleteExerciseSetUseCase',
);
