import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from './domain/entities/workout.entity';
import { WorkoutCategory } from './domain/entities/workout-category.entity';
import { WorkoutExercise } from './domain/entities/workout-exercise.entity';
import { WorkoutSession } from './domain/entities/workout-session.entity';
import { ExerciseSet } from './domain/entities/exercise-set.entity';
import { Exercise } from '../exercises/domain/entities/exercise.entity';
import { WorkoutController } from './infrastructure/controllers/workout.controller';
import { WorkoutSessionController } from './infrastructure/controllers/workout-session.controller';
import { WorkoutService } from './application/services/workout.service';
import { WorkoutSessionService } from './application/services/workout-session.service';
import { TypeOrmWorkoutRepository } from './infrastructure/adapters/typeorm-workout.repository';
import { TypeOrmWorkoutCategoryRepository } from './infrastructure/adapters/typeorm-workout-category.repository';
import { CREATE_WORKOUT_USE_CASE } from './application/ports/in/create-workout.use-case';
import { GET_WORKOUTS_USE_CASE } from './application/ports/in/get-workouts.use-case';
import { GET_WORKOUT_BY_ID_USE_CASE } from './application/ports/in/get-workout-by-id.use-case';
import { DELETE_WORKOUT_USE_CASE } from './application/ports/in/delete-workout.use-case';
import { START_WORKOUT_SESSION_USE_CASE } from './application/ports/in/start-workout-session.use-case';
import { SAVE_EXERCISE_SET_USE_CASE } from './application/ports/in/save-exercise-set.use-case';
import { FINISH_WORKOUT_SESSION_USE_CASE } from './application/ports/in/finish-workout-session.use-case';
import { GET_WORKOUT_SESSIONS_USE_CASE } from './application/ports/in/get-workout-sessions.use-case';
import { GET_WORKOUT_SESSION_BY_ID_USE_CASE } from './application/ports/in/get-workout-session-by-id.use-case';
import { WORKOUT_REPOSITORY_PORT } from './application/ports/out/workout.repository.port';
import { WORKOUT_CATEGORY_REPOSITORY_PORT } from './application/ports/out/workout-category.repository.port';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workout,
      WorkoutCategory,
      WorkoutExercise,
      WorkoutSession,
      ExerciseSet,
      Exercise,
    ]),
  ],
  controllers: [WorkoutController, WorkoutSessionController],
  providers: [
    // Services
    WorkoutService,
    WorkoutSessionService,
    // Workout Use Cases
    {
      provide: CREATE_WORKOUT_USE_CASE,
      useExisting: WorkoutService,
    },
    {
      provide: GET_WORKOUTS_USE_CASE,
      useExisting: WorkoutService,
    },
    {
      provide: GET_WORKOUT_BY_ID_USE_CASE,
      useExisting: WorkoutService,
    },
    {
      provide: DELETE_WORKOUT_USE_CASE,
      useExisting: WorkoutService,
    },
    // Workout Session Use Cases
    {
      provide: START_WORKOUT_SESSION_USE_CASE,
      useExisting: WorkoutSessionService,
    },
    {
      provide: SAVE_EXERCISE_SET_USE_CASE,
      useExisting: WorkoutSessionService,
    },
    {
      provide: FINISH_WORKOUT_SESSION_USE_CASE,
      useExisting: WorkoutSessionService,
    },
    {
      provide: GET_WORKOUT_SESSIONS_USE_CASE,
      useExisting: WorkoutSessionService,
    },
    {
      provide: GET_WORKOUT_SESSION_BY_ID_USE_CASE,
      useExisting: WorkoutSessionService,
    },
    // Repositories
    {
      provide: WORKOUT_REPOSITORY_PORT,
      useClass: TypeOrmWorkoutRepository,
    },
    {
      provide: WORKOUT_CATEGORY_REPOSITORY_PORT,
      useClass: TypeOrmWorkoutCategoryRepository,
    },
  ],
  exports: [
    CREATE_WORKOUT_USE_CASE,
    GET_WORKOUTS_USE_CASE,
    GET_WORKOUT_BY_ID_USE_CASE,
    DELETE_WORKOUT_USE_CASE,
    START_WORKOUT_SESSION_USE_CASE,
    SAVE_EXERCISE_SET_USE_CASE,
    FINISH_WORKOUT_SESSION_USE_CASE,
    GET_WORKOUT_SESSIONS_USE_CASE,
    GET_WORKOUT_SESSION_BY_ID_USE_CASE,
  ],
})
export class WorkoutsModule {}
