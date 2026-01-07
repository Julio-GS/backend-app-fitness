import { CardioSession } from 'src/modules/cardio/domain/entities/cardio-session.entity';

export const CARDIO_SESSION_REPOSITORY = Symbol('CARDIO_SESSION_REPOSITORY');

export interface CardioSessionRepositoryPort {
  create(session: Partial<CardioSession>): Promise<CardioSession>;
  update(id: string, updates: Partial<CardioSession>): Promise<CardioSession>;
  findById(id: string): Promise<CardioSession | null>;
  findHistory(
    userId: string,
    type?: string,
    from?: Date,
    limit?: number,
  ): Promise<CardioSession[]>;
}
