import { WeightTracking } from '../../../domain/entities/weight-tracking.entity';

export abstract class WeightTrackingRepositoryPort {
  abstract create(entry: Partial<WeightTracking>): Promise<WeightTracking>;
  abstract findByUserId(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<WeightTracking[]>;
}
