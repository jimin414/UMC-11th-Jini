import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Member } from './member.entity';

@Entity('rating')
export class Rating {
  @PrimaryGeneratedColumn('increment', {
    name: 'rating_id',
    type: 'bigint',
  })
  ratingId!: string;

  @Column({ name: 'member_id', type: 'bigint' })
  memberId!: string;

  @Column({ name: 'movie_id', type: 'bigint' })
  movieId!: string;

  @Column({ type: 'tinyint' })
  score!: number;

  @Column({ type: 'text', nullable: true })
  comment!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt!: Date;

  @ManyToOne(() => Member, (member) => member.ratings)
  @JoinColumn({ name: 'member_id' })
  member!: Member;
}