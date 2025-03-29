import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Phone } from './phone.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  modified: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @Column()
  token: string;

  @OneToMany(() => Phone, (phone) => phone.user, { cascade: true })
  phones: Phone[];
}
