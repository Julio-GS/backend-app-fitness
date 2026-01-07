import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WorkoutCategory } from './workout-category.entity';
import { WorkoutExercise } from './workout-exercise.entity';

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('uuid', { name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => WorkoutCategory)
  @JoinColumn({ name: 'category_id' })
  category: WorkoutCategory;

  @Column({ type: 'boolean', default: false, name: 'is_preset' })
  isPreset: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy?: string;

  @OneToMany(() => WorkoutExercise, (we) => we.workout, { cascade: true })
  exercises: WorkoutExercise[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
