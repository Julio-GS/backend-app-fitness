import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Tip } from './tip.entity';

@Entity('tip_categories')
export class TipCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, name: 'name_en' })
  nameEn: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  icon?: string;

  @OneToMany(() => Tip, (tip) => tip.category)
  tips: Tip[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
