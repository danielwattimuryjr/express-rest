import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../users/user.entity.ts';

@Entity({
  schema: 'auth',
  name: 'roles',
})
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 20,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  description: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: Relation<User[]>;
}
