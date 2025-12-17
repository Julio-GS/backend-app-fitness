import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserProfile } from './domain/entities/user-profile.entity';
import { WeightTracking } from './domain/entities/weight-tracking.entity';
import { UserProfileService } from './application/services/user-profile.service';
import { TypeOrmUserProfileRepository } from './infrastructure/adapters/typeorm-user-profile.repository';
import { TypeOrmWeightTrackingRepository } from './infrastructure/adapters/typeorm-weight-tracking.repository';
import { UserProfileController } from './infrastructure/controllers/user-profile.controller';
import { UserProfileRepositoryPort } from './application/ports/out/user-profile.repository.port';
import { WeightTrackingRepositoryPort } from './application/ports/out/weight-tracking.repository.port';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, WeightTracking])],
  controllers: [UserProfileController],
  providers: [
    UserProfileService,
    {
      provide: UserProfileRepositoryPort,
      useClass: TypeOrmUserProfileRepository,
    },
    {
      provide: WeightTrackingRepositoryPort,
      useClass: TypeOrmWeightTrackingRepository,
    },
  ],
  exports: [UserProfileService, UserProfileRepositoryPort],
})
export class UsersModule {}
