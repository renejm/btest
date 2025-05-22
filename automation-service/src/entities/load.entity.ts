import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Driver } from './driver.entity';
import { Summary } from './summary.entity';

@Entity()
export class Load {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Driver, (driver) => driver.loads)
  driver: Driver;

  @Column()
  origin: string;

  @Column()
  destination: string;

  @Column('numeric')
  price: number;

  @Column()
  eta: Date;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => Summary, (summary) => summary.load)
  @JoinColumn()
  summary: Summary;
}
