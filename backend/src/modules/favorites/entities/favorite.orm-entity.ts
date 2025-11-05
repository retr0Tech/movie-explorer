import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('favorites')
@Index(['userId', 'imdbId'], { unique: true })
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  @Index()
  userId: string;

  @Column({ name: 'imdb_id' })
  imdbId: string;

  @Column()
  title: string;

  @Column()
  year: string;

  @Column({ nullable: true })
  poster: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ type: 'text', nullable: true })
  plot: string;

  @Column({ name: 'imdb_rating', nullable: true })
  imdbRating: string;

  @Column({ nullable: true })
  director: string;

  @Column({ nullable: true })
  actors: string;

  @Column({ nullable: true })
  runtime: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
