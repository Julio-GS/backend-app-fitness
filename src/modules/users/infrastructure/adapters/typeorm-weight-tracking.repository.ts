import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WeightTrackingRepositoryPort } from '../../application/ports/out/weight-tracking.repository.port';
import { WeightTracking } from '../../domain/entities/weight-tracking.entity';

@Injectable()
export class TypeOrmWeightTrackingRepository implements WeightTrackingRepositoryPort {
  private readonly logger = new Logger(TypeOrmWeightTrackingRepository.name);

  constructor(
    @InjectRepository(WeightTracking)
    private readonly repository: Repository<WeightTracking>,
  ) {}

  async create(entry: Partial<WeightTracking>): Promise<WeightTracking> {
    this.logger.log({ message: 'Creating weight entry', userId: entry.userId });
    const newEntry = this.repository.create(entry);
    return this.repository.save(newEntry);
  }

  async findByUserId(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<WeightTracking[]> {
    this.logger.log({ message: 'Finding weight entries', userId, from, to });

    const queryBuilder = this.repository
      .createQueryBuilder('weight')
      .where('weight.userId = :userId', { userId })
      .orderBy('weight.recordedAt', 'DESC');

    if (from && to) {
      queryBuilder.andWhere('weight.recordedAt BETWEEN :from AND :to', {
        from,
        to,
      });
    } else if (from) {
      queryBuilder.andWhere('weight.recordedAt >= :from', { from });
    } else if (to) {
      queryBuilder.andWhere('weight.recordedAt <= :to', { to });
    }

    return queryBuilder.getMany();
  }
}
