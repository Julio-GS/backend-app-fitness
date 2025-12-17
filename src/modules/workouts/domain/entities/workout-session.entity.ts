import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Workout } from './workout.entity';
import { ExerciseSet } from './exercise-set.entity';
import { SessionStatus } from '../enums/session-status.enum';

@Entity('workout_sessions')
export class WorkoutSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column('uuid', { name: 'workout_id' })
  workoutId: string;

  @ManyToOne(() => Workout)
  @JoinColumn({ name: 'workout_id' })
  workout: Workout;

  @Column({ type: 'timestamp', name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'finished_at' })
  finishedAt?: Date;

  @Column({ type: 'int', nullable: true, name: 'duration_seconds' })
  durationSeconds?: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: SessionStatus.IN_PROGRESS,
    name: 'status',
  })
  status: SessionStatus;

  @OneToMany(() => ExerciseSet, (set) => set.session, { cascade: true })
  sets: ExerciseSet[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
