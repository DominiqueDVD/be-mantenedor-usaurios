import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  number: string;

  @Column()
  citycode: string;

  @Column()
  countrycode: string;

  @ManyToOne(() => User, user => user.phones)
  user: User;
}
