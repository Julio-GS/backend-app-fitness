import { DataSource } from 'typeorm';
import { WorkoutCategory } from '../../domain/entities/workout-category.entity';
import { Workout } from '../../domain/entities/workout.entity';
import { WorkoutExercise } from '../../domain/entities/workout-exercise.entity';

export class WorkoutSeeder {
  static async seed(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(WorkoutCategory);
    const workoutRepository = dataSource.getRepository(Workout);

    console.log('🌱 Seeding workout categories...');

    // Crear categorías
    const categories = [
      { name: 'Full Body', description: 'Entrenamientos de cuerpo completo' },
      { name: 'Upper Body', description: 'Entrenamientos de tren superior' },
      { name: 'Lower Body', description: 'Entrenamientos de tren inferior' },
      { name: 'Push', description: 'Entrenamientos de empuje' },
      { name: 'Pull', description: 'Entrenamientos de tracción' },
      { name: 'Legs', description: 'Entrenamientos de piernas' },
      { name: 'Cardio', description: 'Entrenamientos cardiovasculares' },
      { name: 'Strength', description: 'Entrenamientos de fuerza' },
      { name: 'Hypertrophy', description: 'Entrenamientos de hipertrofia' },
    ];

    const createdCategories: WorkoutCategory[] = [];

    for (const cat of categories) {
      const existing = await categoryRepository.findOne({ where: { name: cat.name } });
      if (!existing) {
        const category = categoryRepository.create(cat);
        const saved = await categoryRepository.save(category);
        createdCategories.push(saved);
        console.log(`✅ Created category: ${cat.name}`);
      } else {
        createdCategories.push(existing);
        console.log(`⏭️  Category already exists: ${cat.name}`);
      }
    }

    console.log('🌱 Seeding preset workouts...');

    // Crear rutinas preset (necesitarás ajustar los exerciseId según tu base de datos)
    const presetWorkouts = [
      {
        name: 'Full Body Beginner',
        description: 'Rutina de cuerpo completo para principiantes',
        categoryName: 'Full Body',
        exercises: [
          // Nota: Estos IDs son ejemplos. Deberás ajustarlos según tus ejercicios.
          // Puedes ejecutar una query para obtener los IDs reales de los ejercicios.
        ],
      },
      // Puedes agregar más rutinas preset aquí
    ];

    for (const preset of presetWorkouts) {
      const category = createdCategories.find(c => c.name === preset.categoryName);
      if (!category) {
        console.log(`⚠️  Category not found for workout: ${preset.name}`);
        continue;
      }

      const existing = await workoutRepository.findOne({ 
        where: { name: preset.name, isPreset: true } 
      });

      if (!existing) {
        const workout = workoutRepository.create({
          name: preset.name,
          description: preset.description,
          category,
          isPreset: true,
          userId: null, // Presets no tienen userId
        });

        const savedWorkout = await workoutRepository.save(workout);
        console.log(`✅ Created preset workout: ${preset.name}`);
      } else {
        console.log(`⏭️  Preset workout already exists: ${preset.name}`);
      }
    }

    console.log('✨ Workout seeding completed!');
  }
}
