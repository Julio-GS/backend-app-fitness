import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardioSession } from '../../domain/entities/cardio-session.entity';
import { CardioSessionRepositoryPort } from '../../application/ports/out/cardio-session.repository.port';

@Injectable()
export class TypeOrmCardioSessionRepository implements CardioSessionRepositoryPort {
  constructor(
    @InjectRepository(CardioSession)
    private readonly repo: Repository<CardioSession>,
  ) {}

  async create(session: Partial<CardioSession>): Promise<CardioSession> {
    const entity = this.repo.create(session);
    return this.repo.save(entity);
  }

  async update(
    id: string,
    updates: Partial<CardioSession>,
  ): Promise<CardioSession> {
    await this.repo.update(id, updates);
    const updated = await this.findById(id);
    if (!updated) throw new Error('Session not found after update');
    return updated;
  }

  async findById(id: string): Promise<CardioSession | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findHistory(
    userId: string,
    type?: string,
    from?: Date,
    limit?: number,
  ): Promise<CardioSession[]> {
    const qb = this.repo
      .createQueryBuilder('cardio')
      .where('cardio.userId = :userId', { userId });
    if (type) qb.andWhere('cardio.type = :type', { type });
    if (from) qb.andWhere('cardio.startedAt >= :from', { from });
    qb.orderBy('cardio.startedAt', 'DESC');
    if (limit) qb.limit(limit);
    return qb.getMany();
  }
}
