import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';

import { BaseTimeEntity } from './base-time.entity';
import { Rating } from './rating.entity';
import { Favorite } from './favorite.entity';

@Entity('member')
export class Member extends BaseTimeEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'member_id',
    type: 'bigint',
  })
  memberId!: string;

  @Column({ type: 'varchar', length: 254, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 60 })
  password!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  nickname!: string;

  @OneToMany(() => Rating, (rating) => rating.member)
  ratings!: Rating[];

  @OneToMany(() => Favorite, (favorite) => favorite.member)
favorites!: Favorite[];
}