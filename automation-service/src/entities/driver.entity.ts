import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Load } from './load.entity';

@Entity()
export class Driver {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Load, (load: Load): Driver => load.driver)
  loads: Load[];
}
