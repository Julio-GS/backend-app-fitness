import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('cardio_sessions')
export class CardioSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  type: 'running' | 'walking';

  @Column({ type: 'timestamp', name: 'started_at' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'finished_at' })
  finishedAt?: Date;

  @Column({ type: 'int', nullable: true, name: 'duration_seconds' })
  durationSeconds?: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    name: 'distance_meters',
  })
  distanceMeters?: number;

  @Column({ type: 'int', nullable: true })
  steps?: number;

  @Column({ type: 'text', nullable: true, name: 'route_polyline' })
  routePolyline?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
