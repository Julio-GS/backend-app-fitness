import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Workout } from './workout.entity';
import { Exercise } from '../../../../exercises/domain/entities/exercise.entity';

@Entity('workout_exercises')
export class WorkoutExercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'workout_id' })
  workoutId: string;

  @ManyToOne(() => Workout, (w) => w.exercises, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;

  @Column('uuid', { name: 'exercise_id' })
  exerciseId: string;

  @ManyToOne(() => Exercise)
  @JoinColumn({ name: 'exercise_id' })
  exercise: Exercise;

  @Column({ type: 'int', name: 'order_index' })
  orderIndex: number;

  @Column({ type: 'int', nullable: true, name: 'default_sets' })
  defaultSets?: number;

  @Column({ type: 'int', nullable: true, name: 'default_reps' })
  defaultReps?: number;

  @Column({ type: 'int', nullable: true, name: 'default_rest_time' })
  defaultRestTime?: number; // segundos

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
