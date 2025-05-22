import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from '../entities/summary.entity';
import { Load } from '../entities/load.entity';

@Injectable()
export class SummaryService {
  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepo: Repository<Summary>,

    @InjectRepository(Load)
    private readonly loadRepo: Repository<Load>,
  ) {}

  async saveSummary(loadId: number, summaryText: string): Promise<Summary> {
    const load = await this.loadRepo.findOne({
      where: { id: loadId },
      relations: ['summary'],
    });

    if (!load) {
      throw new Error(`Load with ID ${loadId} not found`);
    }

    // Remove old summary (if exists)
    if (load.summary) {
      await this.summaryRepo.remove(load.summary);
    }

    const summary = this.summaryRepo.create({
      load,
      summary_text: summaryText,
    });

    return this.summaryRepo.save(summary);
  }
}
