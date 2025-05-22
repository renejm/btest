import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
} from 'typeorm';
import { Load } from './load.entity';

@Entity()
export class Summary {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Load, (load) => load.summary, {
    onDelete: 'CASCADE',
  })
  load: Load;

  @Column('text')
  summary_text: string;

  @CreateDateColumn()
  created_at: Date;
}
