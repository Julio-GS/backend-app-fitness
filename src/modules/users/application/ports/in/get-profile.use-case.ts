import { UserProfile } from '../../../domain/entities/user-profile.entity';

export abstract class GetProfileUseCase {
  abstract getProfile(userId: string): Promise<UserProfile | null>;
}
