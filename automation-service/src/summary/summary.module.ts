import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Summary } from '../entities/summary.entity';
import { Load } from '../entities/load.entity';
import { SummaryService } from './summary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Summary, Load])],
  providers: [SummaryService],
  exports: [SummaryService],
})
export class SummaryModule {}
