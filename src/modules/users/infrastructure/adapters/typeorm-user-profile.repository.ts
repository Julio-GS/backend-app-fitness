import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileRepositoryPort } from '../../application/ports/out/user-profile.repository.port';
import { UserProfile } from '../../domain/entities/user-profile.entity';

@Injectable()
export class TypeOrmUserProfileRepository implements UserProfileRepositoryPort {
  private readonly logger = new Logger(TypeOrmUserProfileRepository.name);

  constructor(
    @InjectRepository(UserProfile)
    private readonly repository: Repository<UserProfile>,
  ) {}

  async findById(userId: string): Promise<UserProfile | null> {
    this.logger.log({ message: 'Finding user profile by ID', userId });
    return this.repository.findOne({ where: { id: userId } });
  }

  async create(profile: Partial<UserProfile>): Promise<UserProfile> {
    this.logger.log({ message: 'Creating user profile', userId: profile.id });
    const newProfile = this.repository.create(profile);
    return this.repository.save(newProfile);
  }

  async update(
    userId: string,
    data: Partial<UserProfile>,
  ): Promise<UserProfile> {
    this.logger.log({ message: 'Updating user profile', userId });
    await this.repository.update({ id: userId }, data);
    const updated = await this.findById(userId);
    if (!updated) {
      throw new Error('Profile not found after update');
    }
    return updated;
  }
}
