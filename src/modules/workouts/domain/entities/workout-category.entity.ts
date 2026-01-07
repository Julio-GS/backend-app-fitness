import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('workout_categories')
export class WorkoutCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string; // 'pecho', 'espalda', etc.

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 50, name: 'name_en' })
  nameEn: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
