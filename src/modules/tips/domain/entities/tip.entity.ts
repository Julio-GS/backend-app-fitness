import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipCategory } from './tip-category.entity';

@Entity('tips')
export class Tip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => TipCategory, (cat) => cat.tips)
  @JoinColumn({ name: 'category_id' })
  category: TipCategory;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 200, name: 'title_en' })
  titleEn: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', name: 'content_en' })
  contentEn: string;

  @Column({ type: 'varchar', length: 500, nullable: true, name: 'banner_image_url' })
  bannerImageUrl?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
