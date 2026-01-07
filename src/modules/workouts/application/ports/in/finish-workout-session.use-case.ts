import { WorkoutSession } from '../../../domain/entities/workout-session.entity';

export interface FinishWorkoutSessionUseCase {
  finishSession(userId: string, sessionId: string): Promise<WorkoutSession>;
}

export const FINISH_WORKOUT_SESSION_USE_CASE = Symbol('FinishWorkoutSessionUseCase');
