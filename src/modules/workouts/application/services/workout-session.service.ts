import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import type { StartWorkoutSessionUseCase } from '../ports/in/start-workout-session.use-case';
import type {
  SaveExerciseSetUseCase,
  SaveExerciseSetDto,
} from '../ports/in/save-exercise-set.use-case';
import type { FinishWorkoutSessionUseCase } from '../ports/in/finish-workout-session.use-case';
import type { GetWorkoutSessionsUseCase } from '../ports/in/get-workout-sessions.use-case';
import type { GetWorkoutSessionByIdUseCase } from '../ports/in/get-workout-session-by-id.use-case';
import type { WorkoutRepositoryPort } from '../ports/out/workout.repository.port';
import { WORKOUT_REPOSITORY_PORT } from '../ports/out/workout.repository.port';
import { WorkoutSession } from '../../domain/entities/workout-session.entity';
import { ExerciseSet } from '../../domain/entities/exercise-set.entity';
import { SessionStatus } from '../../domain/enums/session-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetWorkoutSessionsByWorkoutIdUseCase } from '../ports/in/get-workout-sessions.use-case';
import { DeleteExerciseSetUseCase } from '../ports/in/delete-exercise-set.use-case';

@Injectable()
export class WorkoutSessionService
  implements
    StartWorkoutSessionUseCase,
    SaveExerciseSetUseCase,
    FinishWorkoutSessionUseCase,
    GetWorkoutSessionsUseCase,
    GetWorkoutSessionByIdUseCase,
    GetWorkoutSessionsByWorkoutIdUseCase,
    DeleteExerciseSetUseCase
{
  constructor(
    @Inject(WORKOUT_REPOSITORY_PORT)
    private readonly workoutRepository: WorkoutRepositoryPort,
    @InjectRepository(WorkoutSession)
    private readonly sessionRepository: Repository<WorkoutSession>,
    @InjectRepository(ExerciseSet)
    private readonly setRepository: Repository<ExerciseSet>,
  ) {}

  async execute(
    userId: string,
    workoutId: string,
  ): Promise<WorkoutSession> {
    const workout = await this.workoutRepository.findById(workoutId);
    if (!workout) {
      throw new NotFoundException(`Workout with id ${workoutId} not found`);
    }

    if (!workout.isPreset && workout.createdBy !== userId) {
      throw new ForbiddenException(
        'You do not have permission to start this workout',
      );
    }

    const activeSession = await this.sessionRepository.findOne({
      where: { userId, status: SessionStatus.IN_PROGRESS },
    });

    if (activeSession) {
      throw new BadRequestException(
        'You already have an active workout session. Please finish it first.',
      );
    }

    const session = this.sessionRepository.create({
      userId,
      workout,
      status: SessionStatus.IN_PROGRESS,
      startedAt: new Date(),
    });

    return this.sessionRepository.save(session);
  }

  async saveSet(
    userId: string,
    sessionId: string,
    dto: SaveExerciseSetDto,
  ): Promise<ExerciseSet> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['workout', 'workout.exercises'],
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('You do not have permission to modify this session');
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Cannot add sets to a finished session');
    }

    const exerciseInWorkout = session.workout.exercises.find(
      (we) => we.exerciseId === dto.exerciseId,
    );

    if (!exerciseInWorkout) {
      throw new BadRequestException('Exercise is not part of this workout');
    }

    const set = this.setRepository.create({
      sessionId: session.id,
      exerciseId: dto.exerciseId,
      setNumber: dto.setNumber,
      weightKg: dto.weightKg,
      reps: dto.reps,
    });

    return this.setRepository.save(set);
  }

  async finishSession(
    userId: string,
    sessionId: string,
  ): Promise<WorkoutSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['sets'],
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to finish this session',
      );
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw new BadRequestException('Session is not in progress');
    }

    session.status = SessionStatus.COMPLETED;
    session.finishedAt = new Date();

    const durationMs =
      session.finishedAt.getTime() - session.startedAt.getTime();
    session.durationSeconds = Math.round(durationMs / 1000);

    return this.sessionRepository.save(session);
  }

  async getWorkoutSessions(
    userId: string,
    limit: number = 20,
  ): Promise<WorkoutSession[]> {
    return this.sessionRepository.find({
      where: { userId },
      relations: ['workout', 'workout.category', 'sets'],
      order: { startedAt: 'DESC' },
      take: limit,
    });
  }

  async getSessionById(
    userId: string,
    sessionId: string,
  ): Promise<WorkoutSession> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['workout', 'workout.category', 'sets', 'sets.exercise'],
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to access this session',
      );
    }

    return session;
  }

  async getSessionsByWorkoutId(
    userId: string,
    workoutId: string,
  ): Promise<WorkoutSession[]> {
    return this.sessionRepository.find({
      where: { userId, workoutId },
      relations: ['workout', 'workout.category', 'sets'],
      order: { startedAt: 'DESC' },
    });
  }

  async deleteExerciseSet(
    userId: string,
    sessionId: string,
    setId: string,
  ): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    if (session.userId !== userId) {
      throw new ForbiddenException(
        'You do not have permission to modify this session',
      );
    }

    const set = await this.setRepository.findOne({
      where: { id: setId, sessionId },
    });

    if (!set) {
      throw new NotFoundException(`Set with id ${setId} not found in this session`);
    }

    await this.setRepository.remove(set);
  }
}
