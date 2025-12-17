import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('weight_tracking')
export class WeightTracking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'weight_kg' })
  weightKg: number;

  @CreateDateColumn({ name: 'recorded_at' })
  recordedAt: Date;
}
