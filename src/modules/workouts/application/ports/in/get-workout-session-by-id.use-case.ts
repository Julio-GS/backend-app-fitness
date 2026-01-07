import { WorkoutSession } from '../../../domain/entities/workout-session.entity';

export interface GetWorkoutSessionByIdUseCase {
  getSessionById(userId: string, sessionId: string): Promise<WorkoutSession>;
}

export const GET_WORKOUT_SESSION_BY_ID_USE_CASE = Symbol('GetWorkoutSessionByIdUseCase');
