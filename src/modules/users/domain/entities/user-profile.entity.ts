import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('uuid')
  id: string; // Coincide con auth.users.id de Supabase

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int', nullable: true })
  age?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  height?: number; // cm

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  weight?: number; // kg

  @Column({ type: 'varchar', length: 20, nullable: true })
  gender?: string; // 'male' | 'female' | 'other'

  @Column({ type: 'int', nullable: true, name: 'years_training' })
  yearsTraining?: number;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    name: 'weight_goal',
  })
  weightGoal?: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
