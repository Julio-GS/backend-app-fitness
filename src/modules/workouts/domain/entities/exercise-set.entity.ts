import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { WorkoutSession } from './workout-session.entity';
import { Exercise } from '../../../../exercises/domain/entities/exercise.entity';

@Entity('exercise_sets')
export class ExerciseSet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => WorkoutSession, (s) => s.sets, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: WorkoutSession;

  @Column('uuid', { name: 'exercise_id' })
  exerciseId: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ type: 'int', name: 'set_number' })
  setNumber: number;

  @Column({ type: 'int', nullable: true })
  reps?: number;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    name: 'weight_kg',
  })
  weightKg?: number;

  @CreateDateColumn({ name: 'completed_at' })
  completedAt: Date;
}
