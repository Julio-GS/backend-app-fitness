import { Injectable, Logger } from '@nestjs/common';
import { GetProfileUseCase } from '../ports/in/get-profile.use-case';
import {
  UpdateProfileUseCase,
  UpdateProfileCommand,
} from '../ports/in/update-profile.use-case';
import {
  AddWeightEntryUseCase,
  AddWeightEntryCommand,
} from '../ports/in/add-weight-entry.use-case';
import { UserProfileRepositoryPort } from '../ports/out/user-profile.repository.port';
import { WeightTrackingRepositoryPort } from '../ports/out/weight-tracking.repository.port';
import { UserProfile } from '../../domain/entities/user-profile.entity';
import { WeightTracking } from '../../domain/entities/weight-tracking.entity';

@Injectable()
export class UserProfileService
  implements GetProfileUseCase, UpdateProfileUseCase, AddWeightEntryUseCase
{
  private readonly logger = new Logger(UserProfileService.name);

  constructor(
    private readonly userProfileRepository: UserProfileRepositoryPort,
    private readonly weightTrackingRepository: WeightTrackingRepositoryPort,
  ) {}

  async getProfile(userId: string): Promise<UserProfile | null> {
    this.logger.log({ message: 'Getting user profile', userId });
    return this.userProfileRepository.findById(userId);
  }

  async updateProfile(command: UpdateProfileCommand): Promise<UserProfile> {
    this.logger.log({
      message: 'Updating user profile',
      userId: command.userId,
    });

    const existingProfile = await this.userProfileRepository.findById(
      command.userId,
    );

    if (!existingProfile) {
      // Crear nuevo perfil si no existe
      const newProfile = await this.userProfileRepository.create({
        id: command.userId,
        name: command.name,
        age: command.age,
        height: command.height,
        weight: command.weight,
        gender: command.gender,
        yearsTraining: command.yearsTraining,
        weightGoal: command.weightGoal,
      });

      this.logger.log({ message: 'Profile created', userId: command.userId });
      return newProfile;
    }

    // Actualizar perfil existente
    const updatedProfile = await this.userProfileRepository.update(
      command.userId,
      {
        name: command.name,
        age: command.age,
        height: command.height,
        weight: command.weight,
        gender: command.gender,
        yearsTraining: command.yearsTraining,
        weightGoal: command.weightGoal,
      },
    );

    this.logger.log({ message: 'Profile updated', userId: command.userId });
    return updatedProfile;
  }

  async addWeightEntry(
    command: AddWeightEntryCommand,
  ): Promise<WeightTracking> {
    this.logger.log({ message: 'Adding weight entry', userId: command.userId });

    const entry = await this.weightTrackingRepository.create({
      userId: command.userId,
      weightKg: command.weightKg,
      recordedAt: command.recordedAt || new Date(),
    });

    this.logger.log({
      message: 'Weight entry added',
      userId: command.userId,
      weightKg: command.weightKg,
    });
    return entry;
  }

  async getWeightHistory(
    userId: string,
    from?: Date,
    to?: Date,
  ): Promise<WeightTracking[]> {
    this.logger.log({ message: 'Getting weight history', userId, from, to });
    return this.weightTrackingRepository.findByUserId(userId, from, to);
  }
}
