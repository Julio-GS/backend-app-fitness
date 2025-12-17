import { UserProfile } from '../../../domain/entities/user-profile.entity';

export class UpdateProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly name?: string,
    public readonly age?: number,
    public readonly height?: number,
    public readonly weight?: number,
    public readonly gender?: string,
    public readonly yearsTraining?: number,
    public readonly weightGoal?: number,
  ) {}
}

export abstract class UpdateProfileUseCase {
  abstract updateProfile(command: UpdateProfileCommand): Promise<UserProfile>;
}
