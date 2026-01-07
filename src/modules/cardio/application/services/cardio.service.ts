import { Inject, Injectable } from '@nestjs/common';
import {
  CARDIO_SESSION_REPOSITORY,
  type CardioSessionRepositoryPort,
} from '../ports/out/cardio-session.repository.port';
import { CardioSession } from '../../domain/entities/cardio-session.entity';

@Injectable()
export class CardioService {
  constructor(
    @Inject(CARDIO_SESSION_REPOSITORY)
    private readonly repo: CardioSessionRepositoryPort,
  ) {}

  async startSession(
    userId: string,
    type: 'running' | 'walking',
    startedAt: Date,
  ): Promise<CardioSession> {
    return this.repo.create({ userId, type, startedAt });
  }

  async finishSession(
    sessionId: string,
    finishedAt: Date,
    distanceMeters?: number,
    steps?: number,
    routePolyline?: string,
  ): Promise<CardioSession> {
    const session = await this.repo.findById(sessionId);
    if (!session) throw new Error('Session not found');
    const durationSeconds = Math.floor(
      (finishedAt.getTime() - session.startedAt.getTime()) / 1000,
    );
    return this.repo.update(sessionId, {
      finishedAt,
      durationSeconds,
      distanceMeters,
      steps,
      routePolyline,
    });
  }

  async getHistory(
    userId: string,
    type?: 'running' | 'walking',
    from?: Date,
    limit?: number,
  ): Promise<CardioSession[]> {
    return this.repo.findHistory(userId, type, from, limit);
  }

  async getSessionById(
    sessionId: string,
    userId: string,
  ): Promise<CardioSession | null> {
    const session = await this.repo.findById(sessionId);
    if (!session || session.userId !== userId) return null;
    return session;
  }
}
