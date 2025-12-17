import { UserProfile } from '../../../domain/entities/user-profile.entity';

export abstract class UserProfileRepositoryPort {
  abstract findById(userId: string): Promise<UserProfile | null>;
  abstract create(profile: Partial<UserProfile>): Promise<UserProfile>;
  abstract update(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<UserProfile>;
}
