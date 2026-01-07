import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipCategory } from './domain/entities/tip-category.entity';
import { Tip } from './domain/entities/tip.entity';
import { TipService } from './application/services/tip.service';
import { TipController } from './infrastructure/controllers/tip.controller';
import { TypeOrmTipCategoryRepository } from './infrastructure/adapters/typeorm-tip-category.repository';
import { TypeOrmTipRepository } from './infrastructure/adapters/typeorm-tip.repository';
import { TIP_CATEGORY_REPOSITORY } from './application/ports/out/tip-category.repository.port';
import { TIP_REPOSITORY } from './application/ports/out/tip.repository.port';
@Module({
  imports: [TypeOrmModule.forFeature([TipCategory, Tip])],
  providers: [
    TipService,
    {
      provide: TIP_CATEGORY_REPOSITORY,
      useClass: TypeOrmTipCategoryRepository,
    },
    {
      provide: TIP_REPOSITORY,
      useClass: TypeOrmTipRepository,
    },
  ],
  controllers: [TipController],
  exports: [TipService],
})
export class TipsModule {}
