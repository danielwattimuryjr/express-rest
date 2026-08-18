import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../users/user.entity.ts';

@Entity({
  schema: 'auth',
  name: 'refresh_tokens',
})
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  token: string;

  @Column('timestamp without time zone')
  expiresAt: Date;

  @Column({ type: 'boolean' })
  revoked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  user: Relation<User>;
}
