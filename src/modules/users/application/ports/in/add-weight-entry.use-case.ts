import { WeightTracking } from '../../../domain/entities/weight-tracking.entity';

export class AddWeightEntryCommand {
  constructor(
    public readonly userId: string,
    public readonly weightKg: number,
    public readonly recordedAt?: Date,
  ) {}
}

export abstract class AddWeightEntryUseCase {
  abstract addWeightEntry(
    command: AddWeightEntryCommand,
  ): Promise<WeightTracking>;
}
